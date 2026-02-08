import { Dialog } from "@base-ui/react";
import * as React from "react";

function KoreanColorsLogo() {
	return (
		<div className="relative mr-1 flex h-5 w-5 items-center justify-center">
			<svg
				aria-hidden="true"
				className="drop-shadow-[1px_1px_1px_rgba(0,0,0,0.3)]"
				height="18"
				viewBox="0 0 100 100"
				width="18"
			>
				<defs>
					<mask id="circleMask">
						<circle cx="50" cy="50" fill="white" r="48" />
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
					<circle cx="50" cy="50" fill="#FFD700" r="25" />
				</g>

				{/* Subtle inner glow/border to match XP style if desired, or keep it clean */}
				<circle cx="50" cy="50" fill="none" r="48" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
			</svg>
		</div>
	);
}

export function StartButton(props: { children: React.ReactNode }) {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog.Root modal={false} onOpenChange={setOpen} open={open}>
			<Dialog.Trigger
				className="group /* XP Green Gradient */ /* 3D Border and */ /* The classic XP start button rounding */ /* Hover state */ /* Active/pressed state */ relative flex h-full cursor-pointer items-center rounded-r-[15px] rounded-l-[2px] border-none bg-linear-to-b from-[#3c9a38] via-[#4aaf47] to-[#2e7d32] px-4 font-bold text-[16px] text-white italic shadow shadow-[inset_2px_2px_3px_rgba(255,255,255,0.4),inset_-2px_-2px_3px_rgba(0,0,0,0.3),2px_0_5px_rgba(0,0,0,0.2)] outline-none transition-all duration-75 hover:brightness-110 focus:outline-none active:shadow-[inset_3px_3px_5px_rgba(0,0,0,0.4)] active:brightness-90"
				style={{
					fontFamily: '"Trebuchet MS", sans-serif',
					textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
				}}
			>
				<div className="relative z-10 flex items-center">
					<KoreanColorsLogo />
					<span className="-mt-0.5 ml-1 hidden text-[15px] tracking-tight md:block">사직하기</span>
				</div>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Popup className="fade-in slide-in-from-bottom-2 fixed bottom-[30px] left-0 z-200 min-w-[400px] animate-in overflow-hidden rounded-tr-lg duration-150">
					{props.children}
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
