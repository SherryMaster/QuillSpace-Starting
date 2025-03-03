import React from 'react';
import { ReactNode, useState, useId, useRef, useEffect, isValidElement, useContext } from "react";
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
  Book,
  AlertOctagon
} from "lucide-react";
import { FileStructureView } from './FileStructureView';
import { CodeHighlighter } from "./CodeHighlighter";
import { ExpandedContext } from "@/contexts/ExpandedContext";
import { MarkdownBlock } from './MarkdownBlock';

type ColorVariant =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "cyan"
  | "primary";

interface BlockConfig {
  icon: any;
  containerClass: string;
  badgeClass: string;
  contentClass: string;
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

// Base interface for all blocks (formerly Chapter)
interface ClassicBlockProps {
  title: string;
  subtitle?: string; // New subtitle prop
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  showOnTOC?: boolean;
  type: "Classic";
  features?: boolean;
  parentId?: string;
}

// Generic extends Classic with color options
interface GenericBlockProps extends Omit<ClassicBlockProps, "type"> {
  type: "Generic";
  color?: ColorVariant;
}

// All other blocks extend Generic
interface NoteBlockProps extends Omit<GenericBlockProps, "type" | "color"> {
  type: "Note";
  noteType: "primary" | "secondary" | "info" | "warning" | "critical";
  content?: ReactNode;
}

interface FileStructureBlockProps extends Omit<GenericBlockProps, "type" | "color"> {
  type: "FileStructureView";
  filestructure: Record<string, any>;
}

interface ChallengeBlockProps extends Omit<GenericBlockProps, "type" | "color"> {
  type: "Challenge";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  challengeType: "Exercise" | "Project";  // New field to distinguish between types
  tech?: string[];  // Optional tech stack, renamed from projectTech
  estimatedTime?: string;  // Optional estimated time
  id?: string;
}

// Removed ProjectBlockProps interface
// interface ProjectBlockProps extends Omit<GenericBlockProps, "type" | "color"> {
//   type: "Project";
//   difficulty: "Beginner" | "Intermediate" | "Advanced";
//   projectTech: string[];
//   estimatedTime: string;
//   id?: string;
// }

// Removed PhaseBlockProps

interface CodeBlockProps extends Omit<GenericBlockProps, "type" | "color"> {
  type: "Code";
  code: string;
  extension: string;
}

interface MarkdownBlockProps extends Omit<GenericBlockProps, "type" | "color"> {
  type: "Markdown";
  content: string;
}

export type ContentBlockProps = 
  | ClassicBlockProps
  | GenericBlockProps
  | NoteBlockProps 
  | FileStructureBlockProps 
  | ChallengeBlockProps 
  | CodeBlockProps
  | MarkdownBlockProps;  // Removed ProjectBlockProps

const getBlockConfig = (props: ContentBlockProps): BlockConfig => {
  const blockConfigs: Record<ContentBlockProps["type"], BlockConfig> = {
    Classic: {
      icon: Layout,
      containerClass: "border-gray-500/20 bg-gray-500/5",
      badgeClass: "bg-gray-500/10 text-gray-500",
      contentClass: "bg-gray-500/5"
    },
    Generic: {
      icon: Box,
      containerClass: "border-gray-500/20 bg-gray-500/5",
      badgeClass: "bg-gray-500/10 text-gray-500",
      contentClass: "bg-gray-500/5"
    },
    Note: {
      icon: AlertCircle, // This will be overridden for specific note types
      containerClass: "border-blue-500/20 bg-blue-500/5",
      badgeClass: "bg-blue-500/10 text-blue-500",
      contentClass: "bg-blue-500/5"
    },
    FileStructureView: {
      icon: FolderTree,
      containerClass: "border-green-500/20 bg-green-500/5",
      badgeClass: "bg-green-500/10 text-green-500",
      contentClass: "bg-green-500/5"
    },
    Challenge: {
      icon: Target,
      containerClass: "border-blue-500/20 bg-blue-500/5",
      badgeClass: "bg-blue-500/10 text-blue-500",
      contentClass: "bg-blue-500/5"
    },
    Code: {
      icon: Code,
      containerClass: "border-cyan-500/20 bg-cyan-500/5",
      badgeClass: "bg-cyan-500/10 text-cyan-500",
      contentClass: "bg-cyan-500/5"
    },
    Markdown: {
      icon: FileText,
      containerClass: "border-gray-500/20 bg-gray-500/5",
      badgeClass: "bg-gray-500/10 text-gray-500",
      contentClass: "bg-gray-500/5"
    }
  };

  // Special handling for Note blocks based on noteType
  if (props.type === "Note") {
    const noteProps = props as NoteBlockProps;
    const noteConfig = noteTypeConfig[noteProps.noteType];
    return {
      ...blockConfigs.Note,
      icon: noteConfig.icon,
      containerClass: noteConfig.containerClass,
      badgeClass: `${noteConfig.bgClass} ${noteConfig.textClass}`,
      contentClass: noteConfig.bgClass
    };
  }

  // Special handling for Challenge blocks based on challengeType
  if (props.type === "Challenge") {
    const challengeProps = props as ChallengeBlockProps;
    return {
      ...blockConfigs.Challenge,
      icon: challengeProps.challengeType === "Project" ? Rocket : Target,
      containerClass: challengeProps.challengeType === "Project" 
        ? "border-purple-500/20 bg-purple-500/5"
        : "border-blue-500/20 bg-blue-500/5",
      badgeClass: challengeProps.challengeType === "Project"
        ? "bg-purple-500/10 text-purple-500"
        : "bg-blue-500/10 text-blue-500"
    };
  }

  // For Generic blocks, maintain the same icon but allow color customization
  if (props.type === "Generic" && props.color) {
    return {
      ...blockConfigs.Generic,
      containerClass: `border-${props.color}-500/20 bg-${props.color}-500/5`,
      badgeClass: `bg-${props.color}-500/10 text-${props.color}-500`,
      contentClass: `bg-${props.color}-500/5`
    };
  }

  return blockConfigs[props.type];
};

const noteTypeConfig = {
  primary: {
    containerClass: "border-blue-600/20 bg-blue-600/5",
    textClass: "text-blue-700 dark:text-blue-300",
    bgClass: "bg-blue-500/10",
    iconClass: "text-blue-500",
    icon: Book,
  },
  secondary: {
    containerClass: "border-gray-500/20 bg-gray-500/5",
    textClass: "text-gray-700 dark:text-gray-300",
    bgClass: "bg-gray-500/10",
    iconClass: "text-gray-500",
    icon: FileText,
  },
  info: {
    containerClass: "border-cyan-500/20 bg-cyan-500/5",
    textClass: "text-cyan-700 dark:text-cyan-300",
    bgClass: "bg-cyan-500/10",
    iconClass: "text-cyan-500",
    icon: AlertCircle,
  },
  warning: {
    containerClass: "border-yellow-500/20 bg-yellow-500/5",
    textClass: "text-yellow-700 dark:text-yellow-300",
    bgClass: "bg-yellow-500/10",
    iconClass: "text-yellow-500",
    icon: AlertTriangle,
  },
  critical: {
    containerClass: "border-red-500/20 bg-red-500/5",
    textClass: "text-red-700 dark:text-red-300",
    bgClass: "bg-red-500/10",
    iconClass: "text-red-500",
    icon: AlertOctagon,
  },
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
          <Badge variant="secondary">
            <Target className="w-3 h-3" />
            {stats.challenges} {stats.challenges === 1 ? 'Challenge' : 'Challenges'}
          </Badge>
        )}
        {stats.projects > 0 && (
          <Badge variant="secondary">
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

// Add this helper function to get difficulty badge color
const getDifficultyColor = (difficulty: string) => {
  const colors = {
    Beginner: "bg-green-500/10 text-green-500",
    Intermediate: "bg-yellow-500/10 text-yellow-500",
    Advanced: "bg-red-500/10 text-red-500"
  };
  return colors[difficulty as keyof typeof colors] || colors.Beginner;
};

export function ContentBlock(props: ContentBlockProps) {
  const blockId = useId();
  const [parentId, setParentId] = useState<string>('');
  const { expandedBlocks, setExpandedBlocks } = useContext(ExpandedContext);
  const [isLocalExpanded, setIsLocalExpanded] = useState(true);
  const config = getBlockConfig(props);
  const showOnTOC = props.showOnTOC ?? true;
  const features = props.features ?? false;
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
              {/* Challenge Type Badge */}
              <Badge variant="secondary" className={`${challengeProps.challengeType === 'Project' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {challengeProps.challengeType === 'Project' ? (
                  <><Rocket className="w-3 h-3 mr-1" /> Project</>
                ) : (
                  <><Target className="w-3 h-3 mr-1" /> Exercise</>
                )}
              </Badge>
              
              {/* Difficulty Badge */}
              <Badge variant="secondary" className={getDifficultyColor(challengeProps.difficulty)}>
                {challengeProps.difficulty}
              </Badge>
              {/* Estimated Time Badge */}
              {challengeProps.estimatedTime && (
                <Badge variant="secondary" className="bg-accent/50">
                  <Clock className="w-3 h-3 mr-1" />
                  {challengeProps.estimatedTime}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Tech Stack Badges */}
              {challengeProps.tech && challengeProps.tech.map((tech, index) => (
                <Badge key={index} variant="outline" className="bg-accent/50">
                  {tech}
                </Badge>
              ))}
              </div>

          </div>
        );
      }
      case "Note": {
        // const noteProps = props as NoteBlockProps;
        // const noteConfig = noteTypeConfig[noteProps.noteType];
        // return (
        //   <Badge variant="secondary" className={noteConfig.textClass}>
        //       <noteConfig.icon className={`w-3 h-3 ${noteConfig.iconClass}`} />
        //     {noteProps.noteType.charAt(0).toUpperCase() + noteProps.noteType.slice(1)}
        //   </Badge>
        // );
        return null;
      }
      case "FileStructureView":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
            <FolderTree className="w-3 h-3 mr-1" />
            File Structure
          </Badge>
        );
      case "Code":
        return (
          <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-500">
            <Code className="w-3 h-3 mr-1" />
            Code
          </Badge>
        );
      case "Markdown":
        return (
          <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
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
    // Use the actual icon component name
    'data-block-icon': config.icon.displayName || config.icon.name || 'Box',
    'data-block-color': props.type === "Note" 
      ? noteTypeConfig[(props as NoteBlockProps).noteType].iconClass
      : props.type === "Challenge"
      ? (props as ChallengeBlockProps).challengeType === "Project" 
        ? "text-purple-500"
        : "text-blue-500"
      : props.type === "Generic" && props.color
      ? `text-${props.color}-500`
      : config.badgeClass.split(' ')[1],
    className: `content-block ${
      props.type === "Classic" 
        ? "" 
        : "border-2 p-6 backdrop-blur-sm rounded-lg"
    } ${
      props.type === "Note" 
        ? noteTypeConfig[(props as NoteBlockProps).noteType].containerClass 
        : props.type === "Classic"
        ? ""
        : config.containerClass
    }`
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
              <config.icon className="w-5 h-5" />
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
