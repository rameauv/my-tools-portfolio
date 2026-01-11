import * as React from "react";
import { createContext, useContext, useState, useMemo } from "react";

interface WindowContextType {
  isSnappingWindow: boolean;
  setIsSnappingWindow: (dragging: boolean) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [isSnappingWindow, setIsSnappingWindow] = useState(false);

  const value = useMemo(
    () => ({
      isSnappingWindow,
      setIsSnappingWindow,
    }),
    [isSnappingWindow]
  );

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error("useWindowContext must be used within a WindowProvider");
  }
  return context;
}
