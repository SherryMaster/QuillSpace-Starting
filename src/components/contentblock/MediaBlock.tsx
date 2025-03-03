import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Image as ImageIcon, Film, Music, LucideIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/common';
import { MediaBlockProps, MediaType, VideoTimestamp, VideoBlockProps } from '@/types/media';
import { parseTimestamps, convertToYouTubeEmbedURL } from '@/utils/videoUtils';
import { VideoTimestamps } from './VideoTimestamps';

interface LoadingAnimationProps {
  type: MediaType;
}

function LoadingAnimation({ type }: LoadingAnimationProps) {
  const Icon = mediaTypeConfig[type].icon;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Icon className="w-8 h-8 animate-pulse text-muted-foreground/50" />
    </div>
  );
}

interface ErrorDisplayProps {
  onRetry: () => void;
}

function ErrorDisplay({ onRetry }: ErrorDisplayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/5 backdrop-blur-sm">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm text-red-500">Failed to load media</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md 
          bg-red-500/10 text-red-500 
          hover:bg-red-500/20 hover:scale-105 
          active:scale-95
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-red-500/50"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}

const mediaTypeConfig: Record<MediaType, {
  icon: LucideIcon;
  containerClass: string;
  loadingAnimation: string;
}> = {
  Video: {
    icon: Film,
    containerClass: 'border-purple-500/20 bg-purple-500/5',
    loadingAnimation: 'animate-pulse-video'
  },
  Audio: {
    icon: Music,
    containerClass: 'border-blue-500/20 bg-blue-500/5 p-4',
    loadingAnimation: 'animate-wave'
  },
  Image: {
    icon: ImageIcon,
    containerClass: 'border-green-500/20 bg-green-500/5',
    loadingAnimation: 'animate-pulse'
  },
  GIF: {
    icon: Play,
    containerClass: 'border-yellow-500/20 bg-yellow-500/5',
    loadingAnimation: 'animate-bounce'
  }
};

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: YT;  // Use the YT interface from youtube.d.ts
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function MediaBlock({ 
  url, 
  mediaType, 
  aspectRatio, 
  timestamps = (mediaType === 'Video' ? '' : undefined),
  ...props 
}: MediaBlockProps & Partial<Pick<VideoBlockProps, 'timestamps'>>) {  
  const [status, setStatus] = useState<'loading' | 'error' | 'loaded'>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | HTMLImageElement | null>(null);
  const [parsedTimestamps, setParsedTimestamps] = useState<VideoTimestamp[]>([]);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Process YouTube URL if needed
  const processedUrl = useMemo(() => {
    if (mediaType === 'Video' && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      return convertToYouTubeEmbedURL(url);
    }
    return url;
  }, [url, mediaType]);

  // Initialize YouTube API
  useEffect(() => {
    if (mediaType === 'Video' && processedUrl.includes('youtube.com/embed/')) {
      // Load YouTube API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Initialize player when API is ready
      const initPlayer = () => {
        try {
          const urlObj = new URL(processedUrl);
          const videoId = urlObj.pathname.split('/').pop();
          const clip = urlObj.searchParams.get('clip');
          const clipt = urlObj.searchParams.get('clipt');
          
          if (!videoId) return;
          
          if (!window.YT) return;
          
          playerRef.current = new window.YT.Player(playerContainerRef.current!, {
            videoId,
            playerVars: {
              modestbranding: 1,
              rel: 0,
              controls: 1,
              ...(clip && clipt ? { clip, clipt } : {})
            },
            events: {
              onReady: () => {
                setStatus('loaded');
                
                // Start time tracking
                const timeUpdateInterval = setInterval(() => {
                  if (playerRef.current) {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                  }
                }, 200);

                return () => clearInterval(timeUpdateInterval);
              },
              onStateChange: (event: { data: any; }) => {
                if (window.YT?.PlayerState && event.data === window.YT.PlayerState.PLAYING) {
                  setStatus('loaded');
                }
              },
              onError: () => {
                setStatus('error');
              }
            }
          });
        } catch (error) {
          console.error('Error initializing YouTube player:', error);
          setStatus('error');
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      };
    }
  }, [mediaType, processedUrl]);

  useEffect(() => {
    if (timestamps && mediaType === 'Video') {
      const parsed = parseTimestamps(timestamps);
      setParsedTimestamps(parsed);
    }
  }, [timestamps, mediaType]);

  const handleRetry = () => {
    setStatus('loading');
    
    if (mediaRef.current instanceof HTMLMediaElement) {
      mediaRef.current.load();
    } else if (mediaRef.current instanceof HTMLImageElement) {
      const currentSrc = mediaRef.current.src;
      mediaRef.current.src = '';
      mediaRef.current.src = currentSrc;
    }
  };

  const handleMediaLoaded = () => {
    setStatus('loaded');
    
    // Update current time to trigger timestamp highlighting
    if (mediaRef.current instanceof HTMLVideoElement) {
      setCurrentTime(mediaRef.current.currentTime);
    } else if (playerRef.current) {
      setCurrentTime(playerRef.current.getCurrentTime());
    }
    
    setIsSeeking(false);
  };

  const handleMediaError = (e: React.SyntheticEvent<HTMLMediaElement, Event>) => {
    const mediaElement = e.currentTarget;
    // Only set error state if there's a real error and the media hasn't ended naturally
    if (mediaElement.error && !mediaElement.ended) {
      setStatus('error');
    }
  };

  const handleTimestampClick = (time: number) => {
    if (mediaRef.current instanceof HTMLVideoElement) {
      mediaRef.current.currentTime = time;
    } else if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  const renderYouTubeVideo = () => {
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div 
          ref={playerContainerRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  };

  const renderMedia = () => {
    switch (mediaType) {
      case 'Video':
        if (processedUrl.includes('youtube.com/embed/')) {
          return renderYouTubeVideo();
        }
        // For other videos
        return (
          <video 
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            className="w-full"
            controls={props.controls}
            autoPlay={props.autoPlay}
            onLoadedData={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          >
            <source src={processedUrl} />
          </video>
        );
      case 'Audio': {
        return (
          <div className="w-full flex flex-col gap-2">
            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              className="w-full h-12 [&::-webkit-media-controls-panel]:bg-blue-500/10 
                [&::-webkit-media-controls-current-time-display]:text-blue-500
                [&::-webkit-media-controls-time-remaining-display]:text-blue-500
                [&::-webkit-media-controls-timeline]:bg-blue-500/20
                [&::-webkit-media-controls-play-button]:text-blue-500
                [&::-webkit-media-controls-mute-button]:text-blue-500
                [&::-webkit-media-controls-volume-slider]:bg-blue-500/20
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              controls={props.controls ?? true}
              autoPlay={props.autoPlay}
              preload="metadata"
              onLoadedMetadata={handleMediaLoaded}
              onCanPlay={handleMediaLoaded}
              onError={handleMediaError}
              onEnded={() => setStatus('loaded')}
              onSeeked={handleMediaLoaded}
              onSeeking={() => setIsSeeking(true)}
              onTimeUpdate={() => {
                if (isSeeking) {
                  setIsSeeking(false);
                }
              }}
            >
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      }
      case 'Image':
      case 'GIF':
        return (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={url}
            alt={props.title || 'Media content'}
            className="w-full h-full object-contain"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg',
      mediaTypeConfig[mediaType].containerClass,
      status === 'loading' && mediaTypeConfig[mediaType].loadingAnimation
    )}>
      <div className="relative">
        {renderMedia()}
        {status === 'loading' && <LoadingAnimation type={mediaType} />}
        {status === 'error' && <ErrorDisplay onRetry={handleRetry} />}
      </div>
      {mediaType === 'Video' && parsedTimestamps.length > 0 && (
        <VideoTimestamps 
          timestamps={parsedTimestamps}
          onTimestampClick={handleTimestampClick}
          currentTime={currentTime}
        />
      )}
    </div>
  );
}
