import React from "react";
import { cn } from "../../lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal" | "responsive";
  spacing?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "p-2 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

const gapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

// const spacingClasses = {
//   sm: 'space-y-2 space-x-2',
//   md: 'space-y-4 space-x-4',
//   lg: 'space-y-6 space-x-6',
//   xl: 'space-y-8 space-x-8'
// };

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = "full",
  padding = "md",
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = "md",
}) => {
  const gridCols = cn(
    "grid",
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    gapClasses[gap]
  );

  return <div className={cn(gridCols, className)}>{children}</div>;
};

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className,
  direction = "vertical",
  spacing = "md",
  align = "stretch",
  justify = "start",
}) => {
  const directionClasses = {
    vertical: "flex flex-col",
    horizontal: "flex flex-row",
    responsive: "flex flex-col sm:flex-row",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const spaceClasses =
    direction === "vertical"
      ? `space-y-${
          spacing === "sm"
            ? "2"
            : spacing === "md"
            ? "4"
            : spacing === "lg"
            ? "6"
            : "8"
        }`
      : direction === "horizontal"
      ? `space-x-${
          spacing === "sm"
            ? "2"
            : spacing === "md"
            ? "4"
            : spacing === "lg"
            ? "6"
            : "8"
        }`
      : `space-y-${
          spacing === "sm"
            ? "2"
            : spacing === "md"
            ? "4"
            : spacing === "lg"
            ? "6"
            : "8"
        } sm:space-y-0 sm:space-x-${
          spacing === "sm"
            ? "2"
            : spacing === "md"
            ? "4"
            : spacing === "lg"
            ? "6"
            : "8"
        }`;

  return (
    <div
      className={cn(
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        spaceClasses,
        className
      )}
    >
      {children}
    </div>
  );
};

// Mobile-first responsive breakpoint hooks
export const useResponsive = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...windowSize,
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    isLarge: windowSize.width >= 1280,
  };
};

// Responsive text utilities
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
}> = ({ children, size = "base", weight = "normal", className }) => {
  const sizeClasses = {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <span className={cn(sizeClasses[size], weightClasses[weight], className)}>
      {children}
    </span>
  );
};
