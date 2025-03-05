export interface VideoProgress {
  url: string;
  timestamp: number;
  lastUpdated: number;
  duration?: number;
  title?: string;
}

export interface VideoProgressStore {
  [url: string]: VideoProgress;
}

export interface VideoProgressOptions {
  threshold?: number;     // Minimum duration for saving (default: 3min)
  interval?: number;      // Save interval (default: 5s)
  autoResume?: boolean;   // Auto-restore position
  maxAge?: number;       // Max age for entries in days
}