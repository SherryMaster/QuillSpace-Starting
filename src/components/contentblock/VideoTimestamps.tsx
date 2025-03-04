import { useEffect, useState } from 'react';
import { VideoTimestamp } from '@/types/media';
import { cn } from '@/utils/common';
import { getColorClass } from '@/utils/colors';
import type { ColorToken } from '@/types/colors';

interface TimestampProps {
  timestamps: VideoTimestamp[];
  onTimestampClick: (time: number) => void;
  currentTime: number;
  color?: ColorToken;
}

interface TimestampItemProps {
  timestamp: VideoTimestamp;
  index: number;
  isActive: boolean;
  onClick: () => void;
  color: ColorToken;
}

function TimestampItem({ timestamp, index, isActive, onClick, color }: TimestampItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        "group relative flex items-center gap-2 w-full p-2.5 rounded-lg",
        "transition-all duration-200 ease-out",
        "border",
        
        // Default state
        getColorClass(color, 'border', 5),
        getColorClass(color, 'bg', 5),
        
        // Hover effect background
        "before:absolute before:inset-0 before:rounded-lg",
        "before:transition-opacity before:duration-200",
        `before:${getColorClass(color, 'bg', 10)}`,
        "before:opacity-0 hover:before:opacity-100",
        
        // Active state
        isActive && [
          getColorClass(color, 'border', 20),
          getColorClass(color, 'bg', 10),
          "before:opacity-0"
        ],
        
        // Interactive states
        "hover:scale-[1.02] hover:-translate-y-[1px]",
        "active:scale-[0.98] active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2",
        `focus-visible:${getColorClass(color, 'ring', 20)}`,
      )}
    >
      {/* Index number with circle background */}
      <span className={cn(
        "relative z-10 flex items-center justify-center",
        "w-6 h-6 rounded-full text-xs font-medium",
        "transition-colors duration-200",
        
        // Default state
        getColorClass(color, 'bg', 10),
        getColorClass(color, 'text'),
        
        // Group hover state
        `group-hover:${getColorClass(color, 'bg', 20)}`,
        
        // Active state
        isActive && [
          getColorClass(color, 'bg', 20),
          `group-hover:${getColorClass(color, 'bg', 30)}`
        ]
      )}>
        {index + 1}
      </span>
      
      {/* Timestamp */}
      <span className={cn(
        "relative z-10 font-mono text-sm transition-colors duration-200",
        
        // Default state
        getColorClass(color, 'text', 70),
        
        // Hover state
        `group-hover:${getColorClass(color, 'text')}`,
        
        // Active state
        isActive && getColorClass(color, 'text')
      )}>
        {timestamp.formattedTime}
      </span>
      
      {/* Label with ellipsis */}
      <span className={cn(
        "relative z-10 flex-1 text-sm truncate text-left",
        "transition-colors duration-200",
        
        // Default state
        "text-foreground/70 dark:text-foreground/60",
        
        // Hover state
        "group-hover:text-foreground",
        
        // Active state
        isActive && "text-foreground dark:text-foreground"
      )}>
        {timestamp.label}
      </span>
    </button>
  );
}

export function VideoTimestamps({ 
  timestamps, 
  onTimestampClick, 
  currentTime,
  color = "blue" // Default color
}: TimestampProps) {
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const current = timestamps.findIndex((stamp, idx) => {
      const nextStamp = timestamps[idx + 1];
      return currentTime >= stamp.time && (!nextStamp || currentTime < nextStamp.time);
    });
    setActiveTimestamp(current);
  }, [currentTime, timestamps]);

  return (
    <div className={cn(
      // Container styles
      "mt-4 grid gap-2",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      
      // Scrollable container styles
      timestamps.length > 12 && [
        "max-h-[400px] overflow-y-auto",
        "pr-2 scrollbar-thin",
        getColorClass(color, 'scrollbar-track', 5),
        getColorClass(color, 'scrollbar-thumb', 10),
        `hover:${getColorClass(color, 'scrollbar-thumb', 20)}`
      ]
    )}>
      {timestamps.map((stamp, idx) => (
        <TimestampItem
          key={idx}
          timestamp={stamp}
          index={idx}
          isActive={idx === activeTimestamp}
          onClick={() => onTimestampClick(stamp.time)}
          color={color}
        />
      ))}
    </div>
  );
}
