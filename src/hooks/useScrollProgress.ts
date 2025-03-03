import { useState, useCallback, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    // Request animation frame for smooth updates
    requestAnimationFrame(() => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollable = docHeight - winHeight;
      const scrolled = window.scrollY;

      const progress = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, progress)));
    });
  }, []);

  useEffect(() => {
    // Handle initial load
    handleScroll();

    // Handle dynamic content changes
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(document.body);

    // Handle scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [handleScroll]);

  return progress;
}