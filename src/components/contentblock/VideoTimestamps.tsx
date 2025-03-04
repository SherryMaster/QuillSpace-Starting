import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { VideoTimestamp } from '@/types/media';
import { cn } from '@/utils/common';

interface TimestampProps {
  timestamps: VideoTimestamp[];
  onTimestampClick: (time: number) => void;
  currentTime: number;
}

export function VideoTimestamps({ timestamps, onTimestampClick, currentTime }: TimestampProps) {
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const current = timestamps.findIndex((stamp, idx) => {
      const nextStamp = timestamps[idx + 1];
      return currentTime >= stamp.time && (!nextStamp || currentTime < nextStamp.time);
    });
    setActiveTimestamp(current);
  }, [currentTime, timestamps]);

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {timestamps.map((stamp, idx) => (
        <button
          key={idx}
          onClick={() => onTimestampClick(stamp.time)}
          className={cn(
            "flex items-center gap-2 p-2 rounded-md transition-all",
            "hover:bg-purple-500/10 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
            idx === activeTimestamp && "bg-purple-500/20 text-purple-500"
          )}
        >
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">{stamp.formattedTime}</span>
          <span className="text-sm truncate">{stamp.label}</span>
        </button>
      ))}
    </div>
  );
}
