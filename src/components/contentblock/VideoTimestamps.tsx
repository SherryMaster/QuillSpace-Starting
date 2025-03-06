import { useEffect, useState } from 'react';
import { VideoTimestamp } from '@/types/media';
import { cn } from '@/utils/common';
import { getColorClass } from '@/utils/colors';
import type { ColorToken } from '@/types/colors';
import { Clock } from 'lucide-react';

interface TimestampProps {
  timestamps: VideoTimestamp[];
  onTimestampClick: (time: number) => void;
  currentTime: number;
  color?: ColorToken;
  totalDuration: number; // Add this prop
}

interface TimestampItemProps {
  timestamp: VideoTimestamp;
  nextTimestamp?: VideoTimestamp;
  index: number;
  isActive: boolean;
  onClick: () => void;
  color: ColorToken;
  totalDuration: number;
}

function TimestampItem({ 
  timestamp, 
  nextTimestamp, 
  index, 
  isActive, 
  onClick, 
  color,
  totalDuration 
}: TimestampItemProps) {
  // Calculate duration to next timestamp or end of video
  const durationInSeconds = nextTimestamp 
    ? nextTimestamp.time - timestamp.time
    : totalDuration - timestamp.time;
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        "group relative flex flex-col w-full p-2.5 rounded-lg",
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
      <div className="relative z-10 flex items-start gap-2">
        {/* Index number with circle background */}
        <span className={cn(
          "flex-shrink-0 flex items-center justify-center",
          "w-6 h-6 mt-0.5 rounded-full text-xs font-medium",
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

        <div className="flex-1 min-w-0">
          {/* Timestamp and duration */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-mono text-sm transition-colors duration-200",
              getColorClass(color, 'text', 70),
              `group-hover:${getColorClass(color, 'text')}`,
              isActive && getColorClass(color, 'text')
            )}>
              {timestamp.formattedTime}
            </span>
            
            <span className={cn(
              "flex items-center gap-1 text-xs",
              "text-muted-foreground/50",
              "transition-opacity duration-200",
              "opacity-60 group-hover:opacity-100"
            )}>
              <Clock className="w-3 h-3" />
              {formatDuration(durationInSeconds)}
            </span>
          </div>

          {/* Label with two-line truncate */}
          <p className={cn(
            "relative z-10 text-sm line-clamp-2 text-left mt-0.5",
            "transition-colors duration-200",
            
            // Default state
            "text-foreground/70 dark:text-foreground/60",
            
            // Hover state
            "group-hover:text-foreground",
            
            // Active state
            isActive && "text-foreground dark:text-foreground"
          )}>
            {timestamp.label}
          </p>
        </div>
      </div>
    </button>
  );
}

export function VideoTimestamps({ 
  timestamps, 
  onTimestampClick, 
  currentTime,
  color = "blue",
  totalDuration
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
          nextTimestamp={timestamps[idx + 1]}
          index={idx}
          isActive={idx === activeTimestamp}
          onClick={() => onTimestampClick(stamp.time)}
          color={color}
          totalDuration={totalDuration}
        />
      ))}
    </div>
  );
}
