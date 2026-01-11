import * as React from "react";
import { createContext, useContext, useState, useMemo } from "react";

interface WindowContextType {
  isAnyWindowDragging: boolean;
  setIsAnyWindowDragging: (dragging: boolean) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [isAnyWindowDragging, setIsAnyWindowDragging] = useState(false);

  const value = useMemo(
    () => ({
      isAnyWindowDragging,
      setIsAnyWindowDragging,
    }),
    [isAnyWindowDragging]
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
