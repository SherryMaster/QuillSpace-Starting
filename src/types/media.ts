import type { BaseBlockProps } from '@/components/contentblock/ContentBlock';
import { ColorToken } from './colors';

export type MediaType = 'Video' | 'Audio' | 'Image' | 'GIF';

export interface VideoTimestamp {
  time: number;      // Seconds
  label: string;     // Description
  formattedTime: string; // HH:MM:SS format
}

// Base Media Block Props (remove url from here)
interface BaseMediaBlockProps extends BaseBlockProps {
  type: "Media";
  aspectRatio?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

// Video-specific base props (without url)
interface BaseVideoBlockProps extends BaseMediaBlockProps {
  mediaType: 'Video';
  title: string;
  timestampsColor?: ColorToken;
}

// Single video props (includes url)
export interface SingleVideoBlockProps extends BaseVideoBlockProps {
  url: string;
  timestamps?: string | VideoTimestamp[];
  multiVideo?: never; // Ensure multiVideo cannot be used with url
}

// Multi video props (excludes url)
export interface MultiVideoBlockProps extends BaseVideoBlockProps {
  url?: never; // Ensure url cannot be used with multiVideo
  multiVideo: MultiVideoProps;
}

// Union type for video block props
export type VideoBlockProps = SingleVideoBlockProps | MultiVideoBlockProps;

// Audio-specific props
export interface AudioBlockProps extends BaseMediaBlockProps {
  mediaType: 'Audio';
  url: string;
}

// Image-specific props
export interface ImageBlockProps extends BaseMediaBlockProps {
  mediaType: 'Image';
  url: string;
}

// GIF-specific props
export interface GifBlockProps extends BaseMediaBlockProps {
  mediaType: 'GIF';
  url: string;
}

// Union type for all media block props
export type MediaBlockProps = 
  | VideoBlockProps 
  | AudioBlockProps 
  | ImageBlockProps 
  | GifBlockProps;

export interface MultiVideoProps {
  urls: string[];
  titles: string[];
  timestamps?: (string | VideoTimestamp[])[];
  timestampsColor?: ColorToken;
}
