import { useEffect } from "react";

interface ScrollbarControlOptions {
  hidden?: boolean;
  element?: HTMLElement | null;
}

export function useScrollbarControl({
  hidden = false,
  element = null,
}: ScrollbarControlOptions = {}) {
  useEffect(() => {
    const targetElement = element || document.documentElement;

    if (hidden) {
      targetElement.style.overflow = "hidden";
      // Prevent layout shift when hiding scrollbar
      targetElement.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      targetElement.style.overflow = "";
      targetElement.style.paddingRight = "";
    }

    return () => {
      targetElement.style.overflow = "";
      targetElement.style.paddingRight = "";
    };
  }, [hidden, element]);
}
