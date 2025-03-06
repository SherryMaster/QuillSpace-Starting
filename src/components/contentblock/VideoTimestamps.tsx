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
  currentTime: number;
}

function TimestampItem({ 
  timestamp, 
  nextTimestamp, 
  index, 
  isActive, 
  onClick, 
  color,
  totalDuration,
  currentTime 
}: TimestampItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate duration and progress
  const sectionStart = timestamp.time;
  const sectionEnd = nextTimestamp ? nextTimestamp.time : totalDuration;
  const sectionDuration = sectionEnd - sectionStart;
  
  // Calculate progress percentage
  const progress = Math.min(
    Math.max(
      ((currentTime - sectionStart) / sectionDuration) * 100,
      0
    ),
    100
  );
  const progressPercentage = Math.round(progress);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={cn(
        "group w-full text-left p-3 rounded-lg",
        "hover:bg-background/50",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        `focus-visible:${getColorClass(color, 'ring', 20)}`,
        "relative overflow-hidden" // Important for progress bar
      )}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercentage}
      aria-valuetext={`${progressPercentage}% complete`}
    >
      {/* Progress bar background */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 w-full h-1",
          getColorClass(color, 'bg', 5)
        )}
      />
      
      {/* Active progress bar */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-1",
          "transition-all duration-200 ease-out",
          getColorClass(color, 'bg', isActive ? 30 : 20)
        )}
        style={{ 
          width: `${progress}%`,
          opacity: progress > 0 ? 1 : 0
        }}
      />

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
              {formatDuration(sectionDuration)}
            </span>
          </div>

          {/* Label with two-line truncate */}
          <p className={cn(
            "text-sm line-clamp-2 text-left mt-0.5",
            "transition-colors duration-200"
          )}>
            {timestamp.label}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
          "px-2 py-1 rounded text-xs",
          "bg-background/90 backdrop-blur-sm",
          "border shadow-sm",
          getColorClass(color, 'border', 10)
        )}>
          {formatDuration(sectionDuration)} • {progressPercentage}% complete
        </div>
      )}
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
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}
