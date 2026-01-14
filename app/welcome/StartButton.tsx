import { Dialog } from "@base-ui/react";
import * as React from "react";

function KoreanColorsLogo() {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center mr-1">
      <svg
        width="18"
        height="18"
        viewBox="0 0 100 100"
        className="drop-shadow-[1px_1px_1px_rgba(0,0,0,0.3)]"
        aria-hidden="true"
      >
        <defs>
          <mask id="circleMask">
            <circle cx="50" cy="50" r="48" fill="white" />
          </mask>
        </defs>
        
        <g mask="url(#circleMask)">
          {/* North: Black */}
          <path d="M 0 0 L 100 0 L 50 50 Z" fill="#000000" />
          {/* East: Blue */}
          <path d="M 100 0 L 100 100 L 50 50 Z" fill="#0055A4" />
          {/* South: Red */}
          <path d="M 100 100 L 0 100 L 50 50 Z" fill="#C60C30" />
          {/* West: White */}
          <path d="M 0 100 L 0 0 L 50 50 Z" fill="#FFFFFF" />
          
          {/* Center: Yellow */}
          <circle cx="50" cy="50" r="25" fill="#FFD700" />
        </g>
        
        {/* Subtle inner glow/border to match XP style if desired, or keep it clean */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function StartButton(props: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <Dialog.Trigger
        className="
          group
          relative
          flex items-center
          h-full px-4
          text-white font-bold text-[16px] italic
          cursor-pointer
          border-none
          outline-none
          transition-all duration-75
          focus:outline-none
          
          /* XP Green Gradient */
          bg-linear-to-b from-[#3c9a38] via-[#4aaf47] to-[#2e7d32]
          
          /* 3D Border and shadow */
          shadow-[inset_2px_2px_3px_rgba(255,255,255,0.4),inset_-2px_-2px_3px_rgba(0,0,0,0.3),2px_0_5px_rgba(0,0,0,0.2)]
          
          /* The classic XP start button rounding */
          rounded-r-[15px] rounded-l-[2px]
          
          /* Hover state */
          hover:brightness-110
          
          /* Active/pressed state */
          active:brightness-90
          active:shadow-[inset_3px_3px_5px_rgba(0,0,0,0.4)]
        "
        style={{
          fontFamily: '"Trebuchet MS", sans-serif',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        }}
      >
        <div className="relative z-10 flex items-center">
          <KoreanColorsLogo />
          <span className="ml-1 -mt-0.5 tracking-tight text-[15px]">사직하기</span>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className="fixed bottom-[30px] left-0 min-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-150 z-200 overflow-hidden rounded-tr-lg">
          {props.children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
