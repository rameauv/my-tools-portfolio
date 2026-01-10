import { Dialog } from "@base-ui/react";
import * as React from "react";

function WindowsLogo() {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center mr-1">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className="drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]"
        aria-hidden="true"
      >
        <path
          d="M2.5 4.5C2.5 4.5 6.5 3.5 10.5 5.5V20.5C10.5 20.5 6.5 18.5 2.5 19.5V4.5Z"
          fill="#ee4e23"
        />
        <path
          d="M11.5 5.5C11.5 5.5 16.5 3.5 21.5 5.5V20.5C21.5 20.5 16.5 18.5 11.5 20.5V5.5Z"
          fill="#5da423"
        />
        <path
          d="M2.5 4.5C2.5 4.5 6.5 3.5 10.5 5.5V20.5C10.5 20.5 6.5 18.5 2.5 19.5V4.5Z"
          fill="#f6b323"
          className="opacity-20"
        />
        <path
          d="M2.5 4.5C2.5 4.5 6.5 3.5 10.5 5.5V20.5C10.5 20.5 6.5 18.5 2.5 19.5V4.5Z"
          fill="none"
        />
      </svg>
      {/* More accurate XP logo using four colored shapes */}
      <div className="absolute inset-0 flex flex-wrap w-[14px] h-[14px] m-auto rotate-[-5deg]">
        <div className="w-[7px] h-[7px] bg-[#ee4e23] rounded-tl-[1px] shadow-[0.5px_0.5px_0_rgba(0,0,0,0.2)]"></div>
        <div className="w-[7px] h-[7px] bg-[#5da423] rounded-tr-[1px] shadow-[0.5px_0.5px_0_rgba(0,0,0,0.2)]"></div>
        <div className="w-[7px] h-[7px] bg-[#00a1f1] rounded-bl-[1px] shadow-[0.5px_0.5px_0_rgba(0,0,0,0.2)]"></div>
        <div className="w-[7px] h-[7px] bg-[#f6b323] rounded-br-[1px] shadow-[0.5px_0.5px_0_rgba(0,0,0,0.2)]"></div>
      </div>
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
          <WindowsLogo />
          <span className="ml-1 -mt-0.5 tracking-tight text-[15px]">start</span>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className="fixed bottom-[30px] left-0 min-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-150 z-50 overflow-hidden rounded-tr-lg">
          {props.children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
