import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/theme/ThemeToggle';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { cn } from '@/utils/common';

interface FloatingNavbarProps {
  // Remove title if it's not being used
  // title?: string;
}

export function FloatingNavbar({}: FloatingNavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { toggle } = useMobileMenu();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (!header) return;
      const headerBottom = header.getBoundingClientRect().bottom;
      setIsVisible(headerBottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-background border-b',
        'transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container-base">
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
      </div>
    </nav>
  );
}
