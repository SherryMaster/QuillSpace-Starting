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
  InfoIcon
} from "lucide-react";
import { FileStructureView } from './FileStructureView';
import { CodeHighlighter } from "./CodeHighlighter";
import { ExpandedContext } from "@/contexts/ExpandedContext";
import { MarkdownBlock } from './MarkdownBlock';
import { IconProps } from '@/utils/iconUtils';
import { cn } from '@/utils/common';
import { type ColorToken } from '@/types/colors';
import { getColorClass } from '@/utils/colors';

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
  contentClass: string;
  iconProps?: Partial<IconProps>;
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
interface BaseBlockProps {
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

export type ContentBlockProps = 
  | ClassicBlockProps 
  | GenericBlockProps 
  | NoteBlockProps        // Make sure this is included
  | FileStructureBlockProps 
  | ChallengeBlockProps 
  | CodeBlockProps 
  | MarkdownBlockProps;  // Removed ProjectBlockProps

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
  Markdown: FileText
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
  const icon = getBlockIcon(props);
  
  const blockConfigs: Record<ContentBlockProps["type"], BlockConfig> = {
    Classic: {
      icon,
      containerClass: getColorClass('gray-500', 'border', 20) + ' ' + getColorClass('gray-500', 'bg', 5),
      badgeClass: getColorClass('gray-500', 'bg', 10) + ' ' + getColorClass('gray-500', 'text'),
      contentClass: getColorClass('gray-500', 'bg', 5),
      iconProps: {
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
      containerClass: getColorClass('gray-500', 'border', 20) + ' ' + getColorClass('gray-500', 'bg', 5),
      badgeClass: getColorClass('gray-500', 'bg', 10) + ' ' + getColorClass('gray-500', 'text'),
      contentClass: getColorClass('gray-500', 'bg', 5)
    },
    Note: {
      icon,
      containerClass: getColorClass('blue-500', 'border', 20) + ' ' + getColorClass('blue-500', 'bg', 5),
      badgeClass: getColorClass('blue-500', 'bg', 10) + ' ' + getColorClass('blue-500', 'text'),
      contentClass: getColorClass('blue-500', 'bg', 5)
    },
    FileStructureView: {
      icon,
      containerClass: getColorClass('green-500', 'border', 20) + ' ' + getColorClass('green-500', 'bg', 5),
      badgeClass: getColorClass('green-500', 'bg', 10) + ' ' + getColorClass('green-500', 'text'),
      contentClass: getColorClass('green-500', 'bg', 5)
    },
    Challenge: {
      icon,
      containerClass: getColorClass('blue-500', 'border', 20) + ' ' + getColorClass('blue-500', 'bg', 5),
      badgeClass: getColorClass('blue-500', 'bg', 10) + ' ' + getColorClass('blue-500', 'text'),
      contentClass: getColorClass('blue-500', 'bg', 5)
    },
    Code: {
      icon,
      containerClass: getColorClass('cyan-500', 'border', 20) + ' ' + getColorClass('cyan-500', 'bg', 5),
      badgeClass: getColorClass('cyan-500', 'bg', 10) + ' ' + getColorClass('cyan-500', 'text'),
      contentClass: getColorClass('cyan-500', 'bg', 5)
    },
    Markdown: {
      icon,
      containerClass: getColorClass('gray-500', 'border', 20) + ' ' + getColorClass('gray-500', 'bg', 5),
      badgeClass: getColorClass('gray-500', 'bg', 10) + ' ' + getColorClass('gray-500', 'text'),
      contentClass: getColorClass('gray-500', 'bg', 5)
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
      badgeClass: `bg-${color}/10 text-${color}`,
      contentClass: `bg-${color}/5`
    };
  }

  return config;
};

const noteTypeConfig: Record<NoteBlockProps['noteType'], {
  containerClass: string;
  textClass: string;
  bgClass: string;
  iconClass: string;
  icon: LucideIcon;
}> = {
  primary: {
    containerClass: "border-blue-500/20 bg-blue-500/5",
    textClass: "text-blue-700 dark:text-blue-300",
    bgClass: "bg-blue-500/10",
    iconClass: "text-blue-500",
    icon: InfoIcon
  },
  secondary: {
    containerClass: "border-gray-500/20 bg-gray-500/5",
    textClass: "text-gray-700 dark:text-gray-300",
    bgClass: "bg-gray-500/10",
    iconClass: "text-gray-500",
    icon: HelpCircle
  },
  info: {
    containerClass: "border-cyan-500/20 bg-cyan-500/5",
    textClass: "text-cyan-700 dark:text-cyan-300",
    bgClass: "bg-cyan-500/10",
    iconClass: "text-cyan-500",
    icon: Info
  },
  warning: {
    containerClass: "border-yellow-500/20 bg-yellow-500/5",
    textClass: "text-yellow-700 dark:text-yellow-300",
    bgClass: "bg-yellow-500/10",
    iconClass: "text-yellow-500",
    icon: AlertTriangle
  },
  critical: {
    containerClass: "border-red-500/20 bg-red-500/5",
    textClass: "text-red-700 dark:text-red-300",
    bgClass: "bg-red-500/10",
    iconClass: "text-red-500",
    icon: AlertOctagon
  }
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
                color={challengeProps.challengeType === 'Project' ? 'purple-500' : 'blue-500'}
              >
                {challengeProps.challengeType === 'Project' ? (
                  <><Rocket className="w-3.5 h-3.5" /> Project</>
                ) : (
                  <><Target className="w-3.5 h-3.5" /> Exercise</>
                )}
              </Badge>
              
              <Badge variant="default" color={
                challengeProps.difficulty === 'Beginner' ? 'green-500' :
                challengeProps.difficulty === 'Intermediate' ? 'yellow-500' : 'red-500'
              }>
                {challengeProps.difficulty}
              </Badge>

              {challengeProps.estimatedTime && (
                <Badge variant="outline" color="gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {challengeProps.estimatedTime}
                </Badge>
              )}
            </div>

            {challengeProps.tech && (
              <div className="flex flex-wrap gap-2">
                {challengeProps.tech.map((tech, index) => (
                  <Badge key={index} variant="outline" color="gray-500">
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

  const blockAttributes = {
    id: blockId,
    'data-block-id': blockId,
    'data-block-type': props.type,
    'data-show-toc': showOnTOC,
    'data-parent-id': parentId,
    'data-block-icon': config.icon.displayName || config.icon.name || 'Box',
    'data-block-color': props.type === "Note" 
      ? noteTypeConfig[(props as NoteBlockProps).noteType].iconClass
      : props.type === "Challenge"
      ? (props as ChallengeBlockProps).challengeType === "Project" 
        ? "text-purple-500"
        : "text-blue-500"
      : props.type === "FileStructureView"
      ? "text-green-500"
      : props.type === "Generic" && (props as GenericBlockProps).color
      ? `text-${(props as GenericBlockProps).color}-500`
      : config.badgeClass.split(' ')[1],
    ...(props.type === "Note" && {
      'data-note-type': (props as NoteBlockProps).noteType,
      'data-note-icon': noteTypeConfig[(props as NoteBlockProps).noteType].icon.name
    }),
    className: cn(
      'content-block',
      props.type !== "Classic" && "border-2 p-6 backdrop-blur-sm rounded-lg",
      {
        [noteTypeConfig[(props as NoteBlockProps).noteType]?.containerClass]: props.type === "Note",
        'bg-green-500/5 border-green-500/20': props.type === "FileStructureView",
        [config.containerClass]: props.type !== "Classic" && props.type !== "Note" && props.type !== "FileStructureView",
        'border-purple-500/20': props.type === "Challenge" && (props as ChallengeBlockProps).challengeType === "Project",
        'border-blue-500/20': props.type === "Challenge" && (props as ChallengeBlockProps).challengeType !== "Project",
      },
      props.className
    ),
    style: {
      '--block-depth': parentId ? '1' : '0'
    } as React.CSSProperties
  };

  const featureStats = features ? calculateFeatureStats(props.children) : null;

  return (
    <section {...blockAttributes}>
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
            <div className={`rounded-lg p-4 ${noteTypeConfig[(props as NoteBlockProps).noteType].containerClass}`}>
              <div className={`text-base ${noteTypeConfig[(props as NoteBlockProps).noteType].textClass}`}>
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

          {/* Children */}
          {props.children && (
            <div className="mt-8 space-y-6">
              {props.children}
            </div>
          )}
        </div>

        {/* Footer */}
        {props.footer && (
          <div className="mt-8 pt-4 border-t border-border">
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
