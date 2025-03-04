import type { BaseBlockProps } from '@/components/contentblock/ContentBlock';
import { ColorToken } from './colors';

export type MediaType = 'Video' | 'Audio' | 'Image' | 'GIF';

export interface VideoTimestamp {
  time: number;      // Seconds
  label: string;     // Description
  formattedTime: string; // HH:MM:SS format
}

// Base Media Block Props
interface BaseMediaBlockProps extends BaseBlockProps {
  type: "Media";
  url: string;
  aspectRatio?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

// Video-specific props
export interface VideoBlockProps extends BaseMediaBlockProps {
  mediaType: 'Video';
  timestamps?: string | VideoTimestamp[];
  timestampsColor?: ColorToken;
}

// Audio-specific props
export interface AudioBlockProps extends BaseMediaBlockProps {
  mediaType: 'Audio';
}

// Image-specific props
export interface ImageBlockProps extends BaseMediaBlockProps {
  mediaType: 'Image';
}

// GIF-specific props
export interface GifBlockProps extends BaseMediaBlockProps {
  mediaType: 'GIF';
}

// Union type for all media block props
export type MediaBlockProps = 
  | VideoBlockProps 
  | AudioBlockProps 
  | ImageBlockProps 
  | GifBlockProps;
