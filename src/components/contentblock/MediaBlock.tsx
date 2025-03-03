import { useState, useRef, useEffect } from 'react';
import { Play, Image as ImageIcon, Film, Music, LucideIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/common';
import { MediaBlockProps, MediaType } from '@/types/media';

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

export function MediaBlock({ url, mediaType, aspectRatio, ...props }: MediaBlockProps) {
  const [status, setStatus] = useState<'loading' | 'error' | 'loaded'>('loading');
  const [isSeeking, setIsSeeking] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | HTMLImageElement | null>(null);

  useEffect(() => {
    if (mediaRef.current) {
      if (mediaRef.current instanceof HTMLMediaElement) {
        if (mediaRef.current.readyState >= 2) {
          setStatus('loaded');
        }

        const media = mediaRef.current;
        const handleEnded = () => setStatus('loaded');

        media.addEventListener('ended', handleEnded);
        return () => {
          media.removeEventListener('ended', handleEnded);
        };
      }
    }
  }, [url]);

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
    setIsSeeking(false);
  };

  const handleMediaError = (e: React.SyntheticEvent<HTMLMediaElement, Event>) => {
    const mediaElement = e.currentTarget;
    // Only set error state if there's a real error and the media hasn't ended naturally
    if (mediaElement.error && !mediaElement.ended) {
      setStatus('error');
    }
  };

  const renderMedia = () => {
    switch (mediaType) {
      case 'Video':
        // Check if it's a YouTube URL
        if (url.includes('youtube.com/embed/')) {
          return (
            <iframe
              src={url}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setStatus('loaded')}
              onError={() => setStatus('error')}
            />
          );
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
          >
            <source src={url} />
          </video>
        );
      case 'Audio':
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
      status === 'loading' && !isSeeking && mediaTypeConfig[mediaType].loadingAnimation
    )}>
      {status === 'loading' && !isSeeking && <LoadingAnimation type={mediaType} />}
      {status === 'error' && <ErrorDisplay onRetry={handleRetry} />}
      {renderMedia()}
    </div>
  );
}
