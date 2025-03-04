import React, { ReactNode, useState, useId, useRef, useEffect, isValidElement, useContext, createElement } from "react";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  AlertCircle,
  FolderTree,
  Rocket,
  ChevronDown,
  ChevronRight,
  Layout,
  Box,
  AlertTriangle,
  Copy,
  Check,
  Target,
  Clock,
  Code,
  AlertOctagon,
  LucideIcon,
  Info,
  HelpCircle,
  InfoIcon,
  Film,
  Music,
  Image as ImageIcon,
  Play
} from "lucide-react";
import { FileStructureView } from './FileStructureView';
import { CodeHighlighter } from "./CodeHighlighter";
import { ExpandedContext } from "@/contexts/ExpandedContext";
import { MarkdownBlock } from './MarkdownBlock';
import { IconProps } from '@/utils/iconUtils';
import { cn } from '@/utils/common';
import { type ColorToken } from '@/types/colors';
import { getColorClass } from '@/utils/colors';
import type { MediaType, VideoBlockProps } from '@/types/media';
import { MediaBlock } from './MediaBlock';

const defaultBlockColors = {
  Classic: 'gray',
  Generic: 'gray',
  Note: 'blue',
  FileStructureView: 'green',
  Challenge: 'blue',
  Code: 'cyan',
  Markdown: 'gray',
  Media: 'purple'
} as const;

export const mediaTypeConfig: Record<MediaType, {
  icon: LucideIcon;
  containerClass: string;
  badgeClass: string;
  iconProps?: Partial<IconProps>;
}> = {
  Video: {
    icon: Film,
    containerClass: "border-purple-500/20 bg-purple-500/5",
    badgeClass: "bg-purple-500/10 text-purple-500",
    iconProps: { size: 16 }
  },
  Audio: {
    icon: Music,
    containerClass: "border-blue-500/20 bg-blue-500/5",
    badgeClass: "bg-blue-500/10 text-blue-500",
    iconProps: { size: 16 }
  },
  Image: {
    icon: ImageIcon,
    containerClass: "border-green-500/20 bg-green-500/5",
    badgeClass: "bg-green-500/10 text-green-500",
    iconProps: { size: 16 }
  },
  GIF: {
    icon: Play,
    containerClass: "border-yellow-500/20 bg-yellow-500/5",
    badgeClass: "bg-yellow-500/10 text-yellow-500",
    iconProps: { size: 16 }
  }
};

export interface IconConfig {
  icon?: LucideIcon;
  size?: number;
  color?: ColorToken;
  ariaLabel?: string;
  className?: string;
}

interface BlockConfig {
  icon: LucideIcon;
  containerClass: string;
  badgeClass: string;
  iconProps?: IconProps;
}

interface FeatureStats {
  challenges: number;
  projects: number;
  items: {
    type: 'Challenge' | 'Project';
    title: string;
    id: string;
  }[];
}

// Enhanced base interface
export interface BaseBlockProps {
  title: string;
  subtitle?: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  showOnTOC?: boolean;
  iconConfig?: IconConfig;
  className?: string;
}

// Update ClassicBlockProps
interface ClassicBlockProps extends BaseBlockProps {
  type: "Classic";
  features?: boolean;
  parentId?: string;
}

// Generic extends Classic with color options
interface GenericBlockProps extends Omit<ClassicBlockProps, "type"> {
  type: "Generic";
  color?: ColorToken;
}

// All other blocks extend Generic
interface NoteBlockProps extends BaseBlockProps {
  type: "Note";
  noteType: "primary" | "secondary" | "info" | "warning" | "critical";
  content?: ReactNode;
}

interface FileStructureBlockProps extends BaseBlockProps {
  type: "FileStructureView";
  filestructure: Record<string, any>;
}

interface ChallengeBlockProps extends BaseBlockProps {
  type: "Challenge";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  challengeType: "Exercise" | "Project";
  tech?: string[];
  estimatedTime?: string;
  id?: string;
}

interface CodeBlockProps extends BaseBlockProps {
  type: "Code";
  code: string;
  extension: string;
}

interface MarkdownBlockProps extends BaseBlockProps {
  type: "Markdown";
  content: string;
}

interface MediaBlockProps extends BaseBlockProps {
  type: "Media";
  url: string;
  mediaType: MediaType;
  aspectRatio?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

export type ContentBlockProps = 
  | ClassicBlockProps 
  | GenericBlockProps 
  | NoteBlockProps
  | FileStructureBlockProps 
  | ChallengeBlockProps
  | CodeBlockProps
  | MarkdownBlockProps
  | VideoBlockProps  // Add this
  | MediaBlockProps;  // Keep this for other media types

const noteTypeConfig: Record<NoteBlockProps['noteType'], {
    containerClass: string;
    contentClass: string;
    textClass: string;
    bgClass: string;
    iconClass: string;
    icon: LucideIcon;
}> = {
    primary: {
      containerClass: `border-2 ${getColorClass('blue', 'border', 20)} ${getColorClass('blue', 'bg', 5)}`,
      contentClass: getColorClass('blue', 'bg', 5),
      textClass: "text-blue-700 dark:text-blue-300",
      bgClass: getColorClass('blue', 'bg', 10),
      iconClass: getColorClass('blue', 'text'),
      icon: InfoIcon
    },
    secondary: {
      containerClass: `border-2 ${getColorClass('gray', 'border', 20)} ${getColorClass('gray', 'bg', 5)}`,
      contentClass: getColorClass('gray', 'bg', 5),
      textClass: "text-gray-700 dark:text-gray-300",
      bgClass: getColorClass('gray', 'bg', 10),
      iconClass: getColorClass('gray', 'text'),
      icon: HelpCircle
    },
    info: {
      containerClass: `border-2 ${getColorClass('cyan', 'border', 20)} ${getColorClass('cyan', 'bg', 5)}`,
      contentClass: getColorClass('cyan', 'bg', 5),
      textClass: "text-cyan-700 dark:text-cyan-300",
      bgClass: getColorClass('cyan', 'bg', 10),
      iconClass: getColorClass('cyan', 'text'),
      icon: Info
    },
    warning: {
      containerClass: `border-2 ${getColorClass('yellow', 'border', 20)} ${getColorClass('yellow', 'bg', 5)}`,
      contentClass: getColorClass('yellow', 'bg', 5),
      textClass: "text-yellow-700 dark:text-yellow-300",
      bgClass: getColorClass('yellow', 'bg', 10),
      iconClass: getColorClass('yellow', 'text'),
      icon: AlertTriangle
    },
    critical: {
      containerClass: `border-2 ${getColorClass('red', 'border', 20)} ${getColorClass('red', 'bg', 5)}`,
      contentClass: getColorClass('red', 'bg', 5),
      textClass: "text-red-700 dark:text-red-300",
      bgClass: getColorClass('red', 'bg', 10),
      iconClass: getColorClass('red', 'text'),
      icon: AlertOctagon
    }
};

const DEFAULT_BLOCK_ICONS: Record<ContentBlockProps["type"], LucideIcon | ((props: ContentBlockProps) => LucideIcon)> = {
  Classic: Layout,
  Generic: Box,
  Note: (props: ContentBlockProps) => {
    if (props.type === "Note") {
      return noteTypeConfig[(props as NoteBlockProps).noteType].icon;
    }
    return AlertCircle;
  },
  FileStructureView: FolderTree,
  Challenge: (props: ContentBlockProps) => {
    if (props.type === "Challenge") {
      const challengeProps = props as ChallengeBlockProps;
      return challengeProps.challengeType === "Project" ? Rocket : Target;
    }
    return Target;
  },
  Code: Code,
  Markdown: FileText,
  Media: (props: ContentBlockProps) => {
    if (props.type === "Media") {
      const mediaProps = props as MediaBlockProps;
      return mediaTypeConfig[mediaProps.mediaType].icon;
    }
    return Film;  // Default to Film icon if type check fails
  },
};

const getBlockIcon = (props: ContentBlockProps): LucideIcon => {
  // First check for custom icon in iconConfig
  if (props.iconConfig?.icon) {
    return props.iconConfig.icon;
  }

  const defaultIcon = DEFAULT_BLOCK_ICONS[props.type];

  // Handle function-based icons
  if (typeof defaultIcon === 'function') {
    const iconResult: LucideIcon = defaultIcon(props) as LucideIcon;
    return iconResult;
  }

  // At this point, TypeScript knows defaultIcon must be LucideIcon
  return defaultIcon as LucideIcon;
};

const getBlockConfig = (props: ContentBlockProps): BlockConfig => {
  const initialConfig: BlockConfig = {
    icon: Box,
    containerClass: "bg-background",
    badgeClass: "bg-primary/10 text-primary"
  };

  // Add media block configuration
  if (props.type === "Media") {
    const mediaProps = props as MediaBlockProps;
    const mediaConfig = mediaTypeConfig[mediaProps.mediaType];
    return {
      ...initialConfig,
      icon: mediaConfig.icon,
      containerClass: mediaConfig.containerClass,
      badgeClass: mediaConfig.badgeClass,
      iconProps: {
        icon: mediaConfig.icon,
        ...mediaConfig.iconProps
      }
    };
  }

  const icon = getBlockIcon(props);
  
  const blockConfigs: Record<ContentBlockProps["type"], BlockConfig> = {
    Classic: {
      icon,
      containerClass: getColorClass('gray', 'border', 20) + ' ' + getColorClass('gray', 'bg', 5),
      badgeClass: getColorClass('gray', 'bg', 10) + ' ' + getColorClass('gray', 'text'),
      iconProps: {
        icon,
        size: props.iconConfig?.size || 20,
        className: cn(
          "w-5 h-5",
          props.iconConfig?.color && getColorClass(props.iconConfig.color, 'text'),
          props.iconConfig?.className
        )
      }
    },
    Generic: {
      icon,
      containerClass: getColorClass('gray', 'border', 20) + ' ' + getColorClass('gray', 'bg', 5),
      badgeClass: getColorClass('gray', 'bg', 10) + ' ' + getColorClass('gray', 'text')
    },
    Note: {
      icon,
      containerClass: getColorClass('blue', 'border', 20) + ' ' + getColorClass('blue', 'bg', 5),
      badgeClass: getColorClass('blue', 'bg', 10) + ' ' + getColorClass('blue', 'text')
    },
    FileStructureView: {
      icon,
      containerClass: getColorClass('green', 'border', 20) + ' ' + getColorClass('green', 'bg', 5),
      badgeClass: getColorClass('green', 'bg', 10) + ' ' + getColorClass('green', 'text')
    },
    Challenge: {
      icon,
      containerClass: getColorClass('blue', 'border', 20) + ' ' + getColorClass('blue', 'bg', 5),
      badgeClass: getColorClass('blue', 'bg', 10) + ' ' + getColorClass('blue', 'text')
    },
    Code: {
      icon,
      containerClass: getColorClass('cyan', 'border', 20) + ' ' + getColorClass('cyan', 'bg', 5),
      badgeClass: getColorClass('cyan', 'bg', 10) + ' ' + getColorClass('cyan', 'text')
    },
    Markdown: {
      icon,
      containerClass: getColorClass('gray', 'border', 20) + ' ' + getColorClass('gray', 'bg', 5),
      badgeClass: getColorClass('gray', 'bg', 10) + ' ' + getColorClass('gray', 'text')
    },
    Media: {
      icon,
      containerClass: getColorClass('gray', 'border', 20) + ' ' + getColorClass('gray', 'bg', 5),
      badgeClass: getColorClass('gray', 'bg', 10) + ' ' + getColorClass('gray', 'text')
    }
  };

  let config = { ...blockConfigs[props.type] };

  // Special case handling for Challenge type
  if (props.type === "Challenge") {
    const challengeProps = props as ChallengeBlockProps;
    config = {
      ...config,
      icon: getBlockIcon(props),
      containerClass: challengeProps.challengeType === "Project" 
        ? "border-2 border-purple-500/20 bg-purple-500/5"
        : "border-2 border-blue-500/20 bg-blue-500/5",
      badgeClass: challengeProps.challengeType === "Project"
        ? "bg-purple-500/10 text-purple-500"
        : "bg-blue-500/10 text-blue-500"
    };
  }

  // Handle Generic block with custom color
  if (props.type === "Generic" && (props as GenericBlockProps).color) {
    const color = (props as GenericBlockProps).color;
    config = {
      ...config,
      containerClass: `border-${color}/20 bg-${color}/5`,
      badgeClass: `bg-${color}/10 text-${color}`
    };
  }

  if (props.type === "Note" && (props as NoteBlockProps).noteType) {
    const noteType = (props as NoteBlockProps).noteType;
    const noteConfig = noteTypeConfig[noteType];
    config = {
      ...config,
      icon: noteConfig.icon,
      containerClass: noteConfig.containerClass,
      badgeClass: noteConfig.bgClass,
      iconProps: {
        icon: noteConfig.icon,
        className: cn("w-5 h-5", noteConfig.iconClass),
        size: props.iconConfig?.size || 20
      }
    };
  }

  return config;
};



// Add a utility function to calculate feature stats
function calculateFeatureStats(children: ReactNode): FeatureStats {
  const stats: FeatureStats = {
    challenges: 0,
    projects: 0,
    items: []
  };

  const processNode = (node: ReactNode) => {
    if (!node) return;

    if (isValidElement(node)) {
      const props = node.props as ContentBlockProps;
      
      if (props.type === 'Challenge') {
        const challengeProps = props as ChallengeBlockProps;
        if (challengeProps.challengeType === 'Project') {
          stats.projects++;
          stats.items.push({
            type: 'Project',
            title: props.title,
            id: props.id || `project-${stats.projects}`
          });
        } else {
          stats.challenges++;
          stats.items.push({
            type: 'Challenge',
            title: props.title,
            id: props.id || `challenge-${stats.challenges}`
          });
        }
      }

      if (props.children) {
        React.Children.forEach(props.children, processNode);
      }
    }

    if (Array.isArray(node)) {
      node.forEach(processNode);
    }
  };

  processNode(children);
  return stats;
}

// Add a new FeatureBadge component
function FeatureBadge({ stats }: { stats: FeatureStats }) {
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (stats.challenges === 0 && stats.projects === 0) return null;

  return (
    <div className="relative" ref={badgeRef}>
      <div 
        className="flex gap-2 cursor-pointer"
        onClick={handleClick}
      >
        {stats.challenges > 0 && (
          <Badge variant="default">
            <Target className="w-3 h-3" />
            {stats.challenges} {stats.challenges === 1 ? 'Challenge' : 'Challenges'}
          </Badge>
        )}
        {stats.projects > 0 && (
          <Badge variant="default">
            <Rocket className="w-3 h-3" />
            {stats.projects} {stats.projects === 1 ? 'Project' : 'Projects'}
          </Badge>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 z-50 w-64 bg-popover border rounded-lg shadow-lg">
          <div className="p-2 space-y-1">
            {stats.items.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent flex items-center gap-2"
                onClick={() => handleItemClick(item.id)}
              >
                {item.type === 'Challenge' ? (
                  <Target className="w-4 h-4" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContentBlock(props: ContentBlockProps) {
  const blockId = useId();
  const [parentId, setParentId] = useState<string>('');
  const { expandedBlocks, setExpandedBlocks } = useContext(ExpandedContext);
  const [isLocalExpanded, setIsLocalExpanded] = useState(true);
  const config = getBlockConfig(props);
  const showOnTOC = props.showOnTOC ?? true;
  const features = props.type === "Classic" ? props.features ?? false : false;
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (expandedBlocks.has(blockId)) {
      setIsLocalExpanded(true);
    }
  }, [expandedBlocks, blockId]);

  const isExpanded = isLocalExpanded || expandedBlocks.has(blockId);

  const findParentBlockId = (element: HTMLElement | null): string => {
    if (!element) return '';
    const parentSection = element.parentElement?.closest('section.content-block');
    if (!parentSection) return '';
    return parentSection.id || '';
  };

  useEffect(() => {
    const setRef = (element: HTMLElement | null) => {
      if (element) {
        const foundParentId = findParentBlockId(element);
        setParentId(foundParentId);
      }
    };
    return () => setRef(null);
  }, []);

  const toggleExpanded = () => {
    setIsLocalExpanded(prev => !prev);
    
    if (expandedBlocks.has(blockId)) {
      setExpandedBlocks(prev => {
        const newSet = new Set(prev);
        newSet.delete(blockId);
        return newSet;
      });
    }
  };

  const handleCopyCode = async () => {
    if (props.type === "Code") {
      try {
        await navigator.clipboard.writeText((props as CodeBlockProps).code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  const renderBlockBadges = () => {
    switch (props.type) {
      case "Challenge": {
        const challengeProps = props as ChallengeBlockProps;
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Badge 
                variant="default"
                color={challengeProps.challengeType === 'Project' ? 'purple' : 'blue'}
              >
                {challengeProps.challengeType === 'Project' ? (
                  <><Rocket className="w-3.5 h-3.5" /> Project</>
                ) : (
                  <><Target className="w-3.5 h-3.5" /> Exercise</>
                )}
              </Badge>
              
              <Badge variant="default" color={
                challengeProps.difficulty === 'Beginner' ? 'green' :
                challengeProps.difficulty === 'Intermediate' ? 'yellow' : 'red'
              }>
                {challengeProps.difficulty}
              </Badge>

              {challengeProps.estimatedTime && (
                <Badge variant="outline" color="gray">
                  <Clock className="w-3.5 h-3.5" />
                  {challengeProps.estimatedTime}
                </Badge>
              )}
            </div>

            {challengeProps.tech && (
              <div className="flex flex-wrap gap-2">
                {challengeProps.tech.map((tech, index) => (
                  <Badge key={index} variant="outline" color="gray">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      }
      case "Note": {
        // Remove the badge rendering for Note type
        return null;
      }
      case "FileStructureView":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-500">
            <FolderTree className="w-3 h-3 mr-1" />
            File Structure
          </Badge>
        );
      case "Code":
        return (
          <Badge variant="default" className="bg-cyan-500/10 text-cyan-500">
            <Code className="w-3 h-3 mr-1" />
            Code
          </Badge>
        );
      case "Markdown":
        return (
          <Badge variant="default" className="bg-gray-500/10 text-gray-500">
            <FileText className="w-3 h-3 mr-1" />
            Markdown
          </Badge>
        );
      default:
        return null;
    }
  };

  const getBlockColor = (props: ContentBlockProps): string => {
    if (props.type === "Media") {
      return `text-${mediaTypeConfig[(props as MediaBlockProps).mediaType].badgeClass.split('-')[1]}`;
    }
    
    if (props.type === "Note") {
      return noteTypeConfig[(props as NoteBlockProps).noteType].iconClass;
    }
    
    if (props.type === "Challenge") {
      return (props as ChallengeBlockProps).challengeType === "Project" 
        ? "text-purple-500"
        : "text-blue-500";
    }
    
    if (props.type === "Generic" && (props as GenericBlockProps).color) {
      return `text-${(props as GenericBlockProps).color}-500`;
    }
    
    return `text-${defaultBlockColors[props.type]}-500`;
  };

  const getBlockClassName = (props: ContentBlockProps): string => {
    // Handle Note blocks
    if (props.type === "Note") {
      return noteTypeConfig[(props as NoteBlockProps).noteType]?.containerClass;
    }

    // Handle Challenge blocks
    if (props.type === "Challenge") {
      const color = (props as ChallengeBlockProps).challengeType === "Project" ? "purple" : "blue";
      return cn(
        getColorClass(color, 'bg', 5),
        getColorClass(color, 'border', 20)
      );
    }

    // Handle Media blocks
    if (props.type === "Media") {
      return mediaTypeConfig[(props as MediaBlockProps).mediaType]?.containerClass;
    }

    // Handle Generic blocks with custom color
    if (props.type === "Generic" && (props as GenericBlockProps).color) {
      const color = (props as GenericBlockProps).color;
      if (!color) return ''; // Early return if color is undefined

      return cn(
        getColorClass(color, 'bg', 5),
        getColorClass(color, 'border', 20)
      );
    }

    // Default colors for other block types
    const defaultColor = defaultBlockColors[props.type];
    return cn(
      getColorClass(defaultColor, 'bg', 5),
      getColorClass(defaultColor, 'border', 20)
    );
  };

  const blockAttributes = {
    id: blockId,
    'data-block-id': blockId,
    'data-block-type': props.type,
    'data-show-toc': showOnTOC,
    'data-parent-id': parentId,
    'data-block-icon': config.icon.displayName || config.icon.name || 'Box',
    'data-block-color': getBlockColor(props),
    ...(props.type === "Note" && {
      'data-note-type': (props as NoteBlockProps).noteType,
      'data-note-icon': noteTypeConfig[(props as NoteBlockProps).noteType].icon.name
    }),
    ...(props.type === "Media" && {
      'data-media-type': (props as MediaBlockProps).mediaType,
    }),
    className: cn(
      'content-block',
      props.type !== "Classic" && "border-2 p-6 backdrop-blur-sm rounded-lg",
      getBlockClassName(props),
      props.className // Keep this at the end to allow overrides
    ),
    style: {
      '--block-depth': parentId ? '1' : '0'
    } as React.CSSProperties
  };

  const featureStats = features ? calculateFeatureStats(props.children) : null;

  return (
    <section {...blockAttributes}>
    {/* <section className="content-block border-2 p-6 backdrop-blur-sm rounded-lg border-gray-500/20 bg-gray-500/5">  */}
      {/* Header */}
      <div className="flex w-full items-start justify-between gap-4">
        <div className="space-y-4 flex-1">
          {/* Title and Subtitle */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* Fix the icon rendering here */}
              {props.type === "Note" ? (
                // Special handling for Note type icons
                createElement(
                  props.iconConfig?.icon || noteTypeConfig[(props as NoteBlockProps).noteType].icon,
                  {
                    className: cn(
                      "w-5 h-5",
                      props.iconConfig?.className || noteTypeConfig[(props as NoteBlockProps).noteType].iconClass
                    ),
                    'aria-label': props.iconConfig?.ariaLabel || `${props.title} icon`,
                    size: props.iconConfig?.size || 20
                  }
                )
              ) : (
                // Regular icon rendering for other types
                createElement(config.icon, {
                  ...config.iconProps,
                  'aria-label': props.iconConfig?.ariaLabel || `${props.title} icon`,
                  className: cn(
                    config.iconProps?.className
                  )
                })
              )}
              <h4 role="heading" className="text-lg font-semibold">
                {props.title}
              </h4>
            </div>
            {props.subtitle && (
              <p className="text-sm text-muted-foreground">
                {props.subtitle}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {renderBlockBadges()}
          </div>

          {/* Description */}
          {props.description && (
            <div className="text-base text-muted-foreground/90">
              {props.description}
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={toggleExpanded}
          className="mt-1 p-1 hover:bg-accent/50 rounded"
          type="button"
        >
          {isExpanded ? (
            <ChevronDown className="h-6 w-6 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className={`mt-6 transition-all duration-200 ${
        isExpanded 
          ? "opacity-100 visible" 
          : "opacity-0 invisible h-0 overflow-hidden"
      }`}>
        {/* Block's own content based on type */}
        <div className="space-y-4">
          {props.type === "Note" && (
            <div className={cn(
              "rounded-lg p-4",
              noteTypeConfig[(props as NoteBlockProps).noteType].contentClass
            )}>
              <div className={cn(
                "text-base",
                noteTypeConfig[(props as NoteBlockProps).noteType].textClass
              )}>
                {(props as NoteBlockProps).content}
              </div>
            </div>
          )}

          {props.type === "FileStructureView" && (props as FileStructureBlockProps).filestructure && (
            <div className="rounded-lg bg-black p-4">
              <FileStructureView structure={(props as FileStructureBlockProps).filestructure} />
            </div>
          )}

          {props.type === "Code" && (
            <div className="rounded-lg overflow-hidden relative group">
              <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-white"
                  title="Copy code"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <CodeHighlighter
                code={(props as CodeBlockProps).code}
                extension={(props as CodeBlockProps).extension}
              />
            </div>
          )}

          {props.type === "Markdown" && (
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownBlock content={(props as MarkdownBlockProps).content} />
            </div>
          )}

          {props.type === "Media" && (
            <MediaBlock
              {...(props as MediaBlockProps)}
              url={(props as MediaBlockProps).url}
              mediaType={(props as MediaBlockProps).mediaType}
              type="Media"
              title={props.title}
            />
          )}

          {/* Children content */}
          {props.children && (
            <div className="mt-8 space-y-6">
              {props.children}
            </div>
          )}
        </div>

        {/* Footer */}
        {props.footer && (
          <div className="mt-8 pt-4 border-t">
            {props.footer}
          </div>
        )}

        {/* Feature Stats */}
        {features && featureStats && (
          <div className="mt-6">
            <FeatureBadge stats={featureStats} />
          </div>
        )}
      </div>
    </section>
  );
}

// Add Error Boundary component
export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Icon rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}


