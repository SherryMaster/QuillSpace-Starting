import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface VideoNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
  isTransitioning: boolean;
  videoTitle?: string;    // Only keep the current video title
}

export function VideoNavigation({
  onNext,
  onPrev,
  currentIndex,
  total,
  isTransitioning,
  videoTitle
}: VideoNavigationProps) {
  return (
    <div className="w-full mb-4 flex flex-col items-center gap-2">
      <div className="w-full flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          disabled={isTransitioning || currentIndex === 0}
          className="flex-none bg-background/20 hover:bg-background/40 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 px-4 flex flex-col items-center">
          {videoTitle && (
            <h4 className="text-lg font-semibold text-center line-clamp-1">
              {videoTitle}
            </h4>
          )}
          <span className="text-sm text-muted-foreground mt-1">
            Video {currentIndex + 1} of {total}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={isTransitioning || currentIndex === total - 1}
          className="flex-none bg-background/20 hover:bg-background/40 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
