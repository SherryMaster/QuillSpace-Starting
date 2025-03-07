import { Menu } from "lucide-react";
import { useMobileMenu } from "@/contexts/MobileMenuContext";

export function MobileMenuButton() {
  const { toggle } = useMobileMenu();

  return (
    <button
      onClick={toggle}
      className="lg:hidden fixed top-4 left-4 p-2 bg-background/80 backdrop-blur-sm hover:bg-accent/50 rounded-lg shadow-lg z-50 border"
      aria-label="Toggle menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
