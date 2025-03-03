import { ReactNode } from "react";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { ExpandedProvider } from "@/contexts/ExpandedContext";
import { MobileMenuProvider, useMobileMenu } from "@/contexts/MobileMenuContext";
import { cn } from "@/utils/common";
import { FloatingNavbar } from './FloatingNavbar';
// import { ScrollProgress } from "@/components/navigation/ScrollProgress";

export type ColorVariant = 
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "gray"
  | "dark"
  | "light"
  | "cyan"
  | "orange"
  | "pink"
  | "indigo"
  | "teal"
  | "rose"
  | "lime"
  | "sky"
  | "emerald"
  | "fuchsia"
  | "amber"
  | "violet"
  | "slate"
  | "stone"
  | "zinc"
  | "neutral"
  | "brown";

export interface InteractiveContentLayoutProps {
  children: ReactNode;
  title: string;
  titleBG?: ColorVariant;
  subtitle?: string;
  showTableOfContents?: boolean;
  emphasizedColors?: ColorVariant | ColorVariant[];
}

const gradientColors = {
  blue: {
    text: "from-blue-400 via-blue-300 to-blue-400",
    glow: "bg-blue-500/10"
  },
  red: {
    text: "from-red-400 via-red-300 to-red-400",
    glow: "bg-red-500/10"
  },
  green: {
    text: "from-green-400 via-green-300 to-green-400",
    glow: "bg-green-500/10"
  },
  yellow: {
    text: "from-yellow-400 via-yellow-300 to-yellow-400",
    glow: "bg-yellow-500/10"
  },
  purple: {
    text: "from-purple-400 via-purple-300 to-purple-400",
    glow: "bg-purple-500/10"
  },
  gray: {
    text: "from-gray-400 via-gray-300 to-gray-400",
    glow: "bg-gray-500/10"
  },
  dark: {
    text: "from-gray-800 via-gray-700 to-gray-800",
    glow: "bg-gray-900/10"
  },
  light: {
    text: "from-gray-200 via-gray-100 to-gray-200",
    glow: "bg-gray-300/10"
  },
  cyan: {
    text: "from-cyan-400 via-cyan-300 to-cyan-400",
    glow: "bg-cyan-500/10"
  },
  orange: {
    text: "from-orange-400 via-orange-300 to-orange-400",
    glow: "bg-orange-500/10"
  },
  pink: {
    text: "from-pink-400 via-pink-300 to-pink-400",
    glow: "bg-pink-500/10"
  },
  indigo: {
    text: "from-indigo-400 via-indigo-300 to-indigo-400",
    glow: "bg-indigo-500/10"
  },
  teal: {
    text: "from-teal-400 via-teal-300 to-teal-400",
    glow: "bg-teal-500/10"
  },
  rose: {
    text: "from-rose-400 via-rose-300 to-rose-400",
    glow: "bg-rose-500/10"
  },
  lime: {
    text: "from-lime-400 via-lime-300 to-lime-400",
    glow: "bg-lime-500/10"
  },
  sky: {
    text: "from-sky-400 via-sky-300 to-sky-400",
    glow: "bg-sky-500/10"
  },
  emerald: {
    text: "from-emerald-400 via-emerald-300 to-emerald-400",
    glow: "bg-emerald-500/10"
  },
  fuchsia: {
    text: "from-fuchsia-400 via-fuchsia-300 to-fuchsia-400",
    glow: "bg-fuchsia-500/10"
  },
  amber: {
    text: "from-amber-400 via-amber-300 to-amber-400",
    glow: "bg-amber-500/10"
  },
  violet: {
    text: "from-violet-400 via-violet-300 to-violet-400",
    glow: "bg-violet-500/10"
  },
  slate: {
    text: "from-slate-400 via-slate-300 to-slate-400",
    glow: "bg-slate-500/10"
  },
  stone: {
    text: "from-stone-400 via-stone-300 to-stone-400",
    glow: "bg-stone-500/10"
  },
  zinc: {
    text: "from-zinc-400 via-zinc-300 to-zinc-400",
    glow: "bg-zinc-500/10"
  },
  neutral: {
    text: "from-neutral-400 via-neutral-300 to-neutral-400",
    glow: "bg-neutral-500/10"
  },
  brown: {
    text: "from-[#A0522D] via-[#8B4513] to-[#A0522D]",
    glow: "bg-[#8B4513]/10"
  }
};

function MobileMenuBackdrop() {
  const { isOpen, close } = useMobileMenu();

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background/80 z-40",
        "lg:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        "transition-opacity duration-300"
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
  emphasizedColors
}: InteractiveContentLayoutProps) {
  
  const renderTitle = () => {
    const regex = /'([^']+)'/g;
    let lastIndex = 0;
    const parts = [];
    let match;
    let emphasisCount = 0;

    while ((match = regex.exec(title)) !== null) {
      if (match.index > lastIndex) {
        parts.push(title.substring(lastIndex, match.index));
      }

      let currentColor;
      if (Array.isArray(emphasizedColors)) {
        currentColor = gradientColors[emphasizedColors[emphasisCount % emphasizedColors.length] || "blue"];
      } else if (typeof emphasizedColors === 'string') {
        currentColor = gradientColors[emphasizedColors as ColorVariant];
      } else {
        currentColor = gradientColors["blue"];
      }

      parts.push(
        <span key={match.index} className="relative inline-block px-2">
          <span className={cn(
            "relative z-10 bg-gradient-to-r bg-clip-text text-transparent font-black flex items-center gap-2",
            currentColor.text
          )}>
            {match[1]}
          </span>
          <span className={cn(
            "absolute inset-0 blur-sm rounded-lg",
            currentColor.glow
          )} />
        </span>
      );

      lastIndex = match.index + match[0].length;
      emphasisCount++;
    }

    if (lastIndex < title.length) {
      parts.push(title.substring(lastIndex));
    }

    return parts;
  };

  return (
    <ExpandedProvider>
      <MobileMenuProvider>
        <div className={cn(
          "min-h-screen bg-background",
          `bg-gradient-to-b from-${titleBG}-500/5 via-background to-background`
        )}>
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
              <h1 className={cn(
                `gradient-heading-${titleBG}`,
                "text-3xl lg:text-4xl font-bold text-center p-6"
              )}>
                {renderTitle()}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-center">
                  {subtitle}
                </p>
              )}
            </header>

            <div className="container-base">
              <div className="relative flex flex-col lg:flex-row gap-8">
                {showTableOfContents && (
                  <aside className="lg:w-1/4 lg:min-w-[250px] order-1">
                    <TableOfContents />
                  </aside>
                )}

                <main className={cn(
                  "flex-1 order-2 space-y-8 mb-16",
                  !showTableOfContents && "lg:w-full"
                )}>
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
