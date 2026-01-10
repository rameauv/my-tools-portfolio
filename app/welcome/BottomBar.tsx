import * as React from "react";
import { StartButton } from "./StartButton";
import { StartMenu } from "./StartMenu";
import { StatusSectionClock } from "./StatusSectionClock";

export function BottomBar(props: { children: React.ReactNode }) {
  return (
    <footer 
      className="flex items-center h-[30px] bg-linear-to-b from-[#245edb] via-[#3f8cf3] to-[#245edb] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] relative z-50"
      style={{
        borderTop: '1px solid #00309c',
      }}
    >
      <div className="shrink-0 h-full">
        <StartButton>
          <StartMenu />
        </StartButton>
      </div>
      <div className="flex-1 h-full px-1 overflow-hidden flex items-center gap-1">
        {props.children}
      </div>
      <div className="shrink-0 h-full">
        <StatusIconsSection />
      </div>
    </footer>
  );
}

export function TaskbarButton(props: { title: string; active?: boolean; icon?: string }) {
  return (
    <div 
      className={`
        flex items-center h-[24px] min-w-[150px] max-w-[200px] px-2 rounded-sm cursor-pointer select-none
        ${props.active 
          ? 'bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] border-[#163f8c]' 
          : 'bg-linear-to-b from-[#3c81f0] to-[#245edb] hover:from-[#4c91ff] hover:to-[#346efb] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] border-[#1c56c5]'}
        border
      `}
    >
      {props.icon && (
        <img src={props.icon} alt="" className="w-4 h-4 mr-1.5" />
      )}
      <span 
        className="text-white text-[11px] truncate"
        style={{ fontFamily: 'Tahoma, sans-serif' }}
      >
        {props.title}
      </span>
    </div>
  );
}

function StatusIconsSection(props: {}) {
  return (
    <div 
      className="flex items-center gap-2 h-full px-2 border-l border-[#00309c] shadow-[inset_1px_0_0_rgba(255,255,255,0.2)]"
      style={{
        background: 'linear-gradient(to bottom, #107ceb 0%, #107ceb 100%)',
        backgroundColor: '#107ceb',
      }}
    >
      <StatusSectionClock />
    </div>
  );
}


