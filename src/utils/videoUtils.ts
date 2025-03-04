import { VideoTimestamp } from '@/types/media';

export function parseTimestamps(input: string | VideoTimestamp[]): VideoTimestamp[] {
  if (Array.isArray(input)) return input;

  return input.split('\n')
    .map(line => {
      const match = line.match(/^(\d{1,2}:)?(\d{1,2}):(\d{2})\s*-\s*(.+)$/);
      if (!match) return null;

      const [_, hours, minutes, seconds, label] = match;
      const time = (hours ? parseInt(hours) * 3600 : 0) +
                   parseInt(minutes) * 60 +
                   parseInt(seconds);

      return {
        time,
        label: label.trim(),
        formattedTime: formatTime(time)
      };
    })
    .filter((t): t is VideoTimestamp => t !== null);
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}