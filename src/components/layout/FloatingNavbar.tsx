import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { cn } from "@/utils/common";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface FloatingNavbarProps {
  className?: string;
}

export function FloatingNavbar({ className }: FloatingNavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { toggle } = useMobileMenu();
  const progress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;
      const headerBottom = header.getBoundingClientRect().bottom;
      setIsVisible(headerBottom < 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-sm border-b",
        "transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
        className,
      )}
    >
      {/* Main navbar content */}
      <div className="container-base relative">
        <div className="h-16 flex items-center justify-between">
          <button
            onClick={toggle}
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 w-full h-[2px] bg-muted/20"
          role="presentation"
        >
          <div
            className={cn(
              "h-full bg-primary/80",
              "relative",
              // Gradient effect on the progress bar
              "after:absolute after:top-0 after:right-0",
              "after:h-full after:w-[100px]",
              "after:bg-gradient-to-r after:from-transparent after:to-primary/80",
              // Subtle glow effect
              "before:absolute before:inset-0",
              "before:bg-primary/20 before:blur-sm",
              // Smooth transition
              "transition-all duration-150 ease-out",
            )}
            style={{
              width: `${progress}%`,
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </nav>
  );
}
