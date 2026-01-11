import * as React from "react";
import { useWindowContext } from "./WindowContext";

export function WindowSnapping(props: { children: React.ReactNode }) {
  const { isSnappingWindow } = useWindowContext();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={`
          absolute top-2 left-2 bottom-2 w-[calc(50%-12px)] pointer-events-none z-51
          transition-all duration-300 ease-out
          ${
            isSnappingWindow
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 -translate-x-8 scale-95"
          }
        `}
      >
        <div className="w-full h-full border-2 border-dashed border-white/40 bg-blue-500/10 rounded-2xl flex items-center justify-center shadow-2xl"></div>
      </div>

      <div
        className={`
          absolute top-2 right-2 bottom-2 w-[calc(50%-12px)] pointer-events-none z-51
          transition-all duration-300 ease-out
          ${
            isSnappingWindow
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 translate-x-8 scale-95"
          }
        `}
      >
        <div className="w-full h-full border-2 border-dashed border-white/40 bg-blue-500/10 rounded-2xl flex items-center justify-center shadow-2xl"></div>
      </div>

      <div className="relative z-0 h-full w-full">{props.children}</div>
    </div>
  );
}
