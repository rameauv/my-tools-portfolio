import * as React from "react";
import { useWindowContext } from "./WindowContext";

export function WindowSnapping(props: { children: React.ReactNode }) {
  //   const { isAnyWindowDragging } = useWindowContext();
  const isAnyWindowDragging = true;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Left Snapping Zone */}
      <div
        className={`
          absolute top-2 left-2 bottom-2 w-[calc(50%-12px)] pointer-events-none z-10
          transition-all duration-300 ease-out
          ${
            isAnyWindowDragging
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 -translate-x-8 scale-95"
          }
        `}
      >
        <div className="w-full h-full border-2 border-dashed border-white/40 bg-blue-500/10 backdrop-blur-xs rounded-2xl flex items-center justify-center shadow-2xl">
          <div className="w-16 h-16 border-2 border-white/30 rounded-xl flex items-center justify-center bg-white/5">
            <div className="w-1.5 h-10 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right Snapping Zone */}
      <div
        className={`
          absolute top-2 right-2 bottom-2 w-[calc(50%-12px)] pointer-events-none z-10
          transition-all duration-300 ease-out
          ${
            isAnyWindowDragging
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 translate-x-8 scale-95"
          }
        `}
      >
        <div className="w-full h-full border-2 border-dashed border-white/40 bg-blue-500/10 backdrop-blur-xs rounded-2xl flex items-center justify-center shadow-2xl">
          <div className="w-16 h-16 border-2 border-white/30 rounded-xl flex items-center justify-center bg-white/5">
            <div className="w-1.5 h-10 bg-white/40 rounded-full ml-auto mr-3" />
          </div>
        </div>
      </div>

      <div className="relative z-0 h-full w-full">{props.children}</div>
    </div>
  );
}
