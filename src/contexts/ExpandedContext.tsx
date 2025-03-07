import React, { createContext, useState, ReactNode } from "react";
// Remove useContext from import if it's not being used

interface ExpandedContextType {
  expandedBlocks: Set<string>;
  setExpandedBlocks: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const ExpandedContext = createContext<ExpandedContextType>({
  expandedBlocks: new Set(),
  setExpandedBlocks: () => {},
});

export function ExpandedProvider({ children }: { children: ReactNode }) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  return (
    <ExpandedContext.Provider value={{ expandedBlocks, setExpandedBlocks }}>
      {children}
    </ExpandedContext.Provider>
  );
}

export { ExpandedContext };
