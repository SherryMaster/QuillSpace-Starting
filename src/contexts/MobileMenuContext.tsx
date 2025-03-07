import { createContext, useContext, useState, ReactNode } from "react";
// Remove React import if it's not being used

interface MobileMenuContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export const useMobileMenu = () => useContext(MobileMenuContext);
