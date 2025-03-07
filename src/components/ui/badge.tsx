import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/common";
import { ColorToken } from "@/types/colors";
import { getColorClass } from "@/utils/colors";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
  color?: ColorToken;
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:size-3.5 gap-1.5",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        outline: "border-2 bg-background hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Badge = ({
  variant = "default",
  color,
  className,
  ...props
}: BadgeProps) => {
  const colorClasses = color
    ? {
        default: `${getColorClass(color, "bg", 10)} ${getColorClass(color, "text")} hover:${getColorClass(color, "bg", 20)}`,
        outline: `${getColorClass(color, "border", 20)} ${getColorClass(color, "text")} hover:${getColorClass(color, "bg", 10)}`,
      }[variant]
    : "";

  return (
    <div
      className={cn(badgeVariants({ variant }), colorClasses, className)}
      {...props}
    />
  );
};

export { Badge, badgeVariants };
