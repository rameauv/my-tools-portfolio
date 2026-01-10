import { Dialog } from "@base-ui/react";
import * as React from "react";

function WindowsLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 88 88"
      className="drop-shadow-sm"
      aria-hidden="true"
    >
      {/* Red quadrant (top-left) */}
      <path
        d="M0 12.5L35.7 7.5V42.2H0V12.5Z"
        fill="#F25022"
      />
      {/* Green quadrant (top-right) */}
      <path
        d="M39.5 6.9L87.5 0V42.2H39.5V6.9Z"
        fill="#7FBA00"
      />
      {/* Blue quadrant (bottom-left) */}
      <path
        d="M0 45.8H35.7V80.5L0 75.5V45.8Z"
        fill="#00A4EF"
      />
      {/* Yellow quadrant (bottom-right) */}
      <path
        d="M39.5 45.8H87.5V88L39.5 81.1V45.8Z"
        fill="#FFB900"
      />
    </svg>
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
          flex items-center gap-2
          h-[30px] min-w-[100px] pl-2 pr-4
          rounded-r-[8px] rounded-l-[15px]
          text-white font-bold text-[13px] tracking-wide
          cursor-pointer
          border-none
          outline-none
          transition-all duration-100
          focus:outline-none
          
          /* XP Green Gradient */
          bg-linear-to-b from-[#3c9a38] via-[#3c9a38] to-[#2e7d32]
          
          /* 3D Border effect */
          shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.3)]
          
          /* Glossy top highlight */
          before:content-['']
          before:absolute
          before:top-0
          before:left-0
          before:right-0
          before:h-[45%]
          before:rounded-t-[10px]
          before:rounded-tl-[15px]
          before:bg-linear-to-b
          before:from-[rgba(255,255,255,0.35)]
          before:to-transparent
          before:pointer-events-none
          
          /* Hover state */
          hover:from-[#4aaf47]
          hover:via-[#4aaf47]
          hover:to-[#3c9a38]
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)]
          
          /* Active/pressed state */
          active:from-[#2e7d32]
          active:via-[#2e7d32]
          active:to-[#1b5e20]
          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
        "
        style={{
          fontFamily: '"Trebuchet MS", "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
          fontStyle: 'italic',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <WindowsLogo />
          <span>start</span>
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className="fixed bottom-[72px] left-0 min-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-200 z-50 overflow-hidden">
          {props.children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
