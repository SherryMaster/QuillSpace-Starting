import { VideoProgress, VideoProgressStore } from "@/types/videoProgress";

const STORAGE_KEY = "quill-space-video-progress";
const MAX_STORAGE_ITEMS = 100;
const DEFAULT_MAX_AGE = 30; // days

export class VideoProgressStorage {
  private static instance: VideoProgressStorage;
  private store: VideoProgressStore = {};

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): VideoProgressStorage {
    if (!VideoProgressStorage.instance) {
      VideoProgressStorage.instance = new VideoProgressStorage();
    }
    return VideoProgressStorage.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.store = JSON.parse(stored);
        this.cleanup();
      }
    } catch (error) {
      console.error("Error loading video progress:", error);
      this.store = {};
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store));
    } catch (error) {
      console.error("Error saving video progress:", error);
      this.cleanup(true); // Force cleanup on storage error
    }
  }

  private cleanup(force: boolean = false): void {
    const now = Date.now();
    const maxAge = DEFAULT_MAX_AGE * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    // Sort entries by lastUpdated
    const entries = Object.entries(this.store).sort(
      ([, a], [, b]) => b.lastUpdated - a.lastUpdated,
    );

    // Create new store with only valid entries
    const newStore: VideoProgressStore = {};
    entries.forEach(([url, progress], index) => {
      const isExpired = now - progress.lastUpdated > maxAge;
      const exceedsLimit = index >= MAX_STORAGE_ITEMS;

      if (!isExpired && (!exceedsLimit || !force)) {
        newStore[url] = progress;
      }
    });

    this.store = newStore;
    this.saveToStorage();
  }

  public saveProgress(
    url: string,
    timestamp: number,
    duration?: number,
    title?: string,
  ): void {
    if (!url || timestamp < 0) return;

    this.store[url] = {
      url,
      timestamp,
      lastUpdated: Date.now(),
      duration,
      title,
    };

    this.saveToStorage();
  }

  public getProgress(url: string): VideoProgress | null {
    return this.store[url] || null;
  }

  public clearProgress(url: string): void {
    if (this.store[url]) {
      delete this.store[url];
      this.saveToStorage();
    }
  }

  public clearAll(): void {
    this.store = {};
    this.saveToStorage();
  }

  public getNormalizedUrl(url: string): string {
    // Normalize YouTube URLs to a consistent format
    try {
      const videoId = url.match(
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/,
      )?.[1];
      return videoId ? `https://youtube.com/watch?v=${videoId}` : url;
    } catch {
      return url;
    }
  }
}
