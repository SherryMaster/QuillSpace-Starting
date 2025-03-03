import type { BaseBlockProps } from '@/components/contentblock/ContentBlock';

export type MediaType = 'Video' | 'Audio' | 'Image' | 'GIF';

export interface MediaBlockProps extends BaseBlockProps {
  type: "Media";
  url: string;
  mediaType: MediaType;
  aspectRatio?: string;
  autoPlay?: boolean;
  controls?: boolean;
}
