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

export function convertToYouTubeEmbedURL(url: string): string {
  try {
    // First check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      // Ensure clip parameters are preserved correctly
      const urlObj = new URL(url);
      const videoId = urlObj.pathname.split('/').pop();
      const clip = urlObj.searchParams.get('clip');
      const clipt = urlObj.searchParams.get('clipt');
      
      if (clip && clipt) {
        return `https://www.youtube.com/embed/${videoId}?clip=${clip}&clipt=${clipt}`;
      }
      return url;
    }

    // Extract video ID and clip ID from different YouTube URL formats
    let videoId: string | null = null;
    let clipId: string | null = null;
    let clipTime: string | null = null;

    // Pattern for youtube.com/watch?v=
    const watchPattern = /(?:youtube\.com\/watch\?v=)([^&]+)/;
    // Pattern for youtu.be/
    const shortPattern = /(?:youtu\.be\/)([^?]+)/;
    // Pattern for youtube.com/clip/
    const clipPattern = /(?:youtube\.com\/clip\/)([^?&]+)/;
    // Pattern for clip parameter in URL
    const clipParamPattern = /[?&]clip=([^&]+)/;
    // Pattern for clipt parameter
    const cliptParamPattern = /[?&]clipt=([^&]+)/;

    const watchMatch = url.match(watchPattern);
    const shortMatch = url.match(shortPattern);
    const clipMatch = url.match(clipPattern);
    const clipParamMatch = url.match(clipParamPattern);
    const cliptMatch = url.match(cliptParamPattern);

    // Get video ID from watch or short URL
    videoId = watchMatch?.[1] || shortMatch?.[1] || null;

    // Check for clip ID
    clipId = clipMatch?.[1] || clipParamMatch?.[1] || null;

    // Get clip time if available
    clipTime = cliptMatch?.[1] || null;

    // If no video ID found
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // If it's a clip
    if (clipId) {
      return `https://www.youtube.com/embed/${videoId}?clip=${clipId}&clipt=${clipTime || '1'}`;
    }

    // Regular video URL
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    console.error('Error converting YouTube URL:', error);
    return url;
  }
}
