import { useState, useEffect, useCallback, useRef } from "react";
import { VideoProgressOptions } from "@/types/videoProgress";
import { VideoProgressStorage } from "@/utils/videoProgressStorage";

const DEFAULT_OPTIONS: VideoProgressOptions = {
  threshold: 180, // 3 minutes
  interval: 5, // 5 seconds
  autoResume: true,
  maxAge: 30, // 30 days
};

export function useVideoProgress(
  url: string,
  options: VideoProgressOptions = {},
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const storage = VideoProgressStorage.getInstance();
  const normalizedUrl = storage.getNormalizedUrl(url);

  const [savedPosition, setSavedPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [autoResumeEnabled, setAutoResumeEnabled] = useState(opts.autoResume);

  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedTimeRef = useRef<number>(0);

  const saveProgress = useCallback(
    (time: number, duration?: number, title?: string) => {
      try {
        // Don't save if video is too short
        if (duration && duration < opts.threshold!) return;

        // Don't save if near the end (95% watched)
        if (duration && time > duration * 0.95) {
          storage.clearProgress(normalizedUrl);
          return;
        }

        // Don't save if time hasn't changed significantly (>1s)
        if (Math.abs(time - lastSavedTimeRef.current) < 1) return;

        storage.saveProgress(normalizedUrl, time, duration, title);
        lastSavedTimeRef.current = time;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to save progress"),
        );
      }
    },
    [normalizedUrl, opts.threshold],
  );

  const clearProgress = useCallback(() => {
    try {
      storage.clearProgress(normalizedUrl);
      setSavedPosition(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to clear progress"),
      );
    }
  }, [normalizedUrl]);

  const startProgressSaving = useCallback(
    (time: number, duration?: number, title?: string) => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setInterval(() => {
        saveProgress(time, duration, title);
      }, opts.interval! * 1000);
    },
    [saveProgress, opts.interval],
  );

  const stopProgressSaving = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearInterval(saveTimeoutRef.current);
    }
  }, []);

  // Load saved progress on mount
  useEffect(() => {
    try {
      const progress = storage.getProgress(normalizedUrl);
      if (progress && autoResumeEnabled) {
        setSavedPosition(progress.timestamp);
      }
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load progress"),
      );
      setIsLoading(false);
    }
  }, [normalizedUrl, autoResumeEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressSaving();
    };
  }, [stopProgressSaving]);

  return {
    savedPosition,
    isLoading,
    error,
    actions: {
      saveProgress,
      clearProgress,
      startProgressSaving,
      stopProgressSaving,
      disableAutoResume: () => setAutoResumeEnabled(false),
    },
  };
}
