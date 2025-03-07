import { ReactNode, JSX } from "react";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { ExpandedProvider } from "@/contexts/ExpandedContext";
import {
  MobileMenuProvider,
  useMobileMenu,
} from "@/contexts/MobileMenuContext";
import { cn } from "@/utils/common";
import { FloatingNavbar } from "./FloatingNavbar";
// import { ScrollProgress } from "@/components/navigation/ScrollProgress";
import { ColorToken } from "@/types/colors";
import { getColorClass } from "@/utils/colors";

export interface InteractiveContentLayoutProps {
  children: ReactNode;
  title: string;
  titleBG?: ColorToken;
  subtitle?: string;
  showTableOfContents?: boolean;
  emphasizedColors?: ColorToken | ColorToken[];
}

const getGradientConfig = (color: ColorToken) => ({
  text: cn(
    getColorClass(color, "text"),
    "relative z-10", // Add z-index to ensure text stays above the glow
    "bg-gradient-to-r",
    `from-${color}-500 via-${color}-400 to-${color}-500`,
    "bg-clip-text text-transparent",
  ),
  glow: cn(
    "absolute inset-0 -z-10", // Position behind the text
    "bg-gradient-to-r",
    `from-${color}-500/50 via-${color}-400/50 to-${color}-500/50`,
    "blur-lg",
  ),
});

function MobileMenuBackdrop() {
  const { isOpen, close } = useMobileMenu();

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background/80 z-40",
        "lg:hidden",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
        "transition-opacity duration-300",
      )}
      onClick={close}
    />
  );
}

export function InteractiveContentLayout({
  children,
  title,
  titleBG = "blue",
  subtitle,
  showTableOfContents = true,
  emphasizedColors = "blue",
}: InteractiveContentLayoutProps) {
  const renderTitle = (titleText: string) => {
    // Updated regex to match text between single quotes
    const regex = /'([^']+)'/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let emphasisCount = 0;
    let match: RegExpExecArray | null;

    // If no matches, return the whole text
    if (!titleText.match(regex)) {
      return [titleText];
    }

    while ((match = regex.exec(titleText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(titleText.substring(lastIndex, match.index));
      }

      // Determine the color to use
      let currentColor: ColorToken;
      if (Array.isArray(emphasizedColors)) {
        currentColor =
          emphasizedColors[emphasisCount % emphasizedColors.length] || "blue";
      } else {
        currentColor = emphasizedColors;
      }

      const gradientConfig = getGradientConfig(currentColor);

      // Add the emphasized part
      parts.push(
        <span key={match.index} className="relative inline-block">
          <span className={gradientConfig.text}>{match[1]}</span>
          <span className={gradientConfig.glow} aria-hidden="true" />
        </span>,
      );

      lastIndex = match.index + match[0].length;
      emphasisCount++;
    }

    // Add any remaining text
    if (lastIndex < titleText.length) {
      parts.push(titleText.substring(lastIndex));
    }

    return parts;
  };

  return (
    <ExpandedProvider>
      <MobileMenuProvider>
        <div
          className={cn(
            "min-h-screen bg-background",
            getColorClass(titleBG, "bg", 5),
          )}
        >
          <FloatingNavbar />

          <div className="container-base">
            <div className="flex items-center justify-end py-4 lg:py-4">
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <header className="container-base pb-6">
              <div
                className={cn(
                  "rounded-lg p-6",
                  `gradient-heading-${titleBG}`, // Using the gradient heading classes from index.css
                )}
              >
                <h1
                  className={cn("text-3xl lg:text-4xl font-bold text-center")}
                >
                  {renderTitle(title)}
                </h1>
                {subtitle && (
                  <p className="text-muted-foreground text-center mt-2">
                    {subtitle}
                  </p>
                )}
              </div>
            </header>

            <div className="container-base">
              <div className="relative flex flex-col lg:flex-row gap-8">
                {showTableOfContents && (
                  <aside className="lg:w-1/4 lg:min-w-[250px] order-1">
                    <TableOfContents />
                  </aside>
                )}

                <main
                  className={cn(
                    "flex-1 order-2 space-y-8 mb-16",
                    !showTableOfContents && "lg:w-full",
                  )}
                >
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>

        <MobileMenuBackdrop />
      </MobileMenuProvider>
    </ExpandedProvider>
  );
}
