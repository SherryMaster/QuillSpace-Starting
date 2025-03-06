import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Image as ImageIcon, Film, Music, LucideIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/common';
import { MediaBlockProps, MediaType, MultiVideoBlockProps, SingleVideoBlockProps, VideoBlockProps, VideoTimestamp, YouTubeURL } from '@/types/media';
import { parseTimestamps, convertToYouTubeEmbedURL } from '@/utils/videoUtils';
import { VideoTimestamps } from './VideoTimestamps';
import { VideoNavigation } from './VideoNavigation';
import { useVideoProgress } from '@/hooks/useVideoProgress';

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

// Add URL validation error component
function InvalidURLError() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/5 backdrop-blur-sm">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm text-red-500">Invalid YouTube URL</p>
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
  getDuration: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: YT;  // Use the YT interface from youtube.d.ts
    onYouTubeIframeAPIReady?: () => void;
  }
}

const getVideoDuration = (player: YouTubePlayer | null): number => {
  try {
    if (player && typeof player.getDuration === 'function') {
      return player.getDuration();
    }
    return 0;
  } catch (error) {
    console.error('Error getting video duration:', error);
    return 0;
  }
};

const getCurrentTime = (player: YouTubePlayer | null): number => {
  try {
    if (player && typeof player.getCurrentTime === 'function') {
      return player.getCurrentTime();
    }
    return 0;
  } catch (error) {
    console.error('Error getting current time:', error);
    return 0;
  }
};

export function MediaBlock({ 
  url = '' as YouTubeURL, 
  title = '', 
  mediaType, 
  aspectRatio,
  className,
  ...props 
}: MediaBlockProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Remove isValidURL state and validation effects since TypeScript handles it
  
  // Extract video-specific props and narrow the type
  const videoProps = props as VideoBlockProps;
  const isMultiVideo = 'multiVideo' in videoProps;

  // Get current URL and timestamps based on multiVideo state
  const currentUrl = useMemo(() => {
    if (mediaType !== 'Video') return url;
    
    if (isMultiVideo) {
      const multiVideoProps = videoProps as MultiVideoBlockProps;
      return multiVideoProps.multiVideo.urls[currentVideoIndex];
    }
    return (videoProps as SingleVideoBlockProps).url;
  }, [mediaType, videoProps, currentVideoIndex, url, isMultiVideo]);

  // Safely access properties based on video type
  const timestamps = isMultiVideo 
    ? (videoProps as MultiVideoBlockProps).multiVideo.timestamps 
    : (videoProps as SingleVideoBlockProps).timestamps;
  
  const timestampsColor = videoProps.timestampsColor;
  const multiVideo = isMultiVideo ? (videoProps as MultiVideoBlockProps).multiVideo : undefined;

  // Get current timestamps based on multiVideo state
  const currentTimestamps = multiVideo ? multiVideo.timestamps?.[currentVideoIndex] : timestamps;

  // Add navigation controls if needed
  const showNavigation = multiVideo && multiVideo.urls.length > 1;

  const handleNext = () => {
    if (isTransitioning || !multiVideo) return;
    setIsTransitioning(true);
    
    try {
      if (playerRef.current) {
        const currentTime = getCurrentTime(playerRef.current);
        const duration = getVideoDuration(playerRef.current);
        saveProgress(
          currentTime,
          duration,
          multiVideo.titles[currentVideoIndex]
        );
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
    
    stopProgressSaving();
    setCurrentTime(0);
    setVideoDuration(0);
    
    // Destroy current player before switching
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    setCurrentVideoIndex((prev) => (prev + 1) % multiVideo.urls.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrev = () => {
    if (isTransitioning || !multiVideo) return;
    setIsTransitioning(true);
    
    try {
      if (playerRef.current) {
        const currentTime = getCurrentTime(playerRef.current);
        const duration = getVideoDuration(playerRef.current);
        saveProgress(
          currentTime,
          duration,
          multiVideo.titles[currentVideoIndex]
        );
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
    
    stopProgressSaving();
    setCurrentTime(0);
    setVideoDuration(0);
    
    // Destroy current player before switching
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    setCurrentVideoIndex((prev) => (prev - 1 + multiVideo.urls.length) % multiVideo.urls.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const [status, setStatus] = useState<'loading' | 'error' | 'loaded'>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | HTMLImageElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const {
    savedPosition,
    actions: {
      saveProgress,
      startProgressSaving,
      stopProgressSaving
    }
  } = useVideoProgress(currentUrl);

  // Process YouTube URL if needed
  const processedUrl = useMemo(() => {
    if (mediaType === 'Video' && currentUrl && (currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be'))) {
      return convertToYouTubeEmbedURL(currentUrl);
    }
    return currentUrl;
  }, [currentUrl, mediaType]);

  // Initialize YouTube API
  useEffect(() => {
    if (mediaType === 'Video' && processedUrl && processedUrl.includes('youtube.com/embed/')) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const initPlayer = () => {
        try {
          const urlObj = new URL(processedUrl);
          const videoId = urlObj.pathname.split('/').pop();
          
          if (!videoId || !window.YT) return;
          
          interface YTPlayerEvent {
            target: YouTubePlayer & {
              getDuration: () => number;
              getVideoData: () => { title: string };
            };
          }

          interface YTStateChangeEvent extends YTPlayerEvent {
            data: number;
          }
          
          playerRef.current = new window.YT.Player(playerContainerRef.current!, {
            videoId,
            playerVars: {
              modestbranding: 1,
              rel: 0,
              controls: 1,
              start: Math.floor(savedPosition || 0)
            },
            events: {
              onReady: (event: YTPlayerEvent) => {
                setStatus('loaded');
                const player = event.target;
                const duration = getVideoDuration(player);
                setVideoDuration(duration); // Store duration in state
                const title = player.getVideoData().title;
                
                // Set initial time
                setCurrentTime(player.getCurrentTime());

                // Start progress tracking
                const updateProgress = () => {
                  const currentTime = player.getCurrentTime();
                  setCurrentTime(currentTime); // Update current time state
                  saveProgress(currentTime, duration, title);
                  startProgressSaving(currentTime, duration, title);
                };

                // Initial progress save
                updateProgress();

                // Set up interval for regular progress updates
                const progressInterval = setInterval(updateProgress, 5000);

                // Cleanup interval on player destroy
                const originalDestroy = player.destroy;
                player.destroy = () => {
                  clearInterval(progressInterval);
                  originalDestroy.call(player);
                };
              },
              onStateChange: (event: YTStateChangeEvent) => {
                if (window.YT?.PlayerState) {
                  const player = event.target;
                  const currentTime = player.getCurrentTime();
                  setCurrentTime(currentTime); // Update current time on state change
                  const duration = getVideoDuration(player);
                  setVideoDuration(duration); // Update duration on state change
                  const title = player.getVideoData().title;

                  if (event.data === window.YT.PlayerState.PLAYING) {
                    setStatus('loaded');
                    startProgressSaving(currentTime, duration, title);
                  } else if (
                    event.data === window.YT.PlayerState.PAUSED ||
                    event.data === window.YT.PlayerState.ENDED
                  ) {
                    stopProgressSaving();
                    saveProgress(currentTime, duration, title);
                  }
                }
              },
              onError: () => {
                setStatus('error');
                stopProgressSaving();
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
        stopProgressSaving();
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      };
    }
  }, [mediaType, processedUrl, savedPosition, saveProgress, startProgressSaving, stopProgressSaving]);

  // Add a time update interval for YouTube player
  useEffect(() => {
    if (mediaType === 'Video' && playerRef.current && !isTransitioning) {
      const timeUpdateInterval = setInterval(() => {
        if (playerRef.current) {
          const time = getCurrentTime(playerRef.current);
          setCurrentTime(time);
        }
      }, 100);

      return () => clearInterval(timeUpdateInterval);
    }
  }, [mediaType, isTransitioning]);

  useEffect(() => {
    if (timestamps && mediaType === 'Video') {
      // Check if timestamps is a nested array (for multiVideo)
      if (Array.isArray(timestamps) && Array.isArray(timestamps[0])) {
        return; // Skip processing for multiVideo timestamps array
      }
      // Now TypeScript knows timestamps is either string | VideoTimestamp[]
      parseTimestamps(timestamps as string | VideoTimestamp[]);
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
    } else if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(time, true);
      } catch (error) {
        console.error('Error seeking to timestamp:', error);
      }
    }
  };

  const isValidYouTubeURL = (url: string): url is YouTubeURL => {
    return url.match(/^(https:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i) !== null;
  };

  const renderYouTubeVideo = () => {
    if (!processedUrl || !isValidYouTubeURL(processedUrl)) return null;
    
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
    if (mediaType === 'Video' && (!processedUrl || !isValidYouTubeURL(processedUrl))) {
      return <InvalidURLError />;
    }

    switch (mediaType) {
      case 'Video':
        if (processedUrl?.includes('youtube.com/embed/')) {
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
            alt={title || 'Media content'} // Use the title from props directly
            className="w-full h-full object-contain"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        );
      default:
        return null;
    }
  };

  // Get current video title if available
  const currentVideoTitle = multiVideo?.titles?.[currentVideoIndex];

  return (
    <div className={cn("space-y-4", className)}>
      {showNavigation && (
        <VideoNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentVideoIndex}
          total={multiVideo?.urls.length || 1}
          isTransitioning={isTransitioning}
          videoTitle={currentVideoTitle}  // Only pass the current video title
        />
      )}
      
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        mediaTypeConfig[mediaType].containerClass,
        status === 'loading' && mediaTypeConfig[mediaType].loadingAnimation
      )}>
        {renderMedia()}
        {status === 'loading' && <LoadingAnimation type={mediaType} />}
        {status === 'error' && <ErrorDisplay onRetry={handleRetry} />}
      </div>

      {mediaType === 'Video' && currentTimestamps && currentTimestamps.length > 0 && (
        <div className="mt-4">
          <VideoTimestamps
            timestamps={parseTimestamps(
              Array.isArray(currentTimestamps) && Array.isArray(currentTimestamps[0])
                ? currentTimestamps[currentVideoIndex] as string | VideoTimestamp[]
                : currentTimestamps as string | VideoTimestamp[]
            )}
            onTimestampClick={handleTimestampClick}
            currentTime={currentTime}
            color={timestampsColor || "purple"}
            totalDuration={videoDuration} // Use the state instead of direct player access
          />
        </div>
      )}
    </div>
  );
}
