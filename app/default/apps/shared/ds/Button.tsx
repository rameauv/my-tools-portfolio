import type { ReactNode } from "react";
import { cn } from "~/utils/cn";

interface ButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
	type?: "button" | "submit";
	className?: string;
	icon?: ReactNode;
}

export function Button(props: ButtonProps) {
	return (
		<button
			className={cn(
				"relative min-h-[23px] min-w-[75px] rounded-[2.5px] border px-3 py-1",
				"text-center font-normal text-[11px]",
				props.disabled
					? "cursor-default border-black/20 bg-[#f5f4ea] text-black/33"
					: cn(
							"cursor-pointer border-[#1c5180] bg-linear-to-b from-[#ffffff] to-[#f0f0ea] text-[#000000]",
							"[box-shadow:-1px_-1px_0_0_rgba(0,0,0,0.05),1px_1px_0_0_rgba(255,255,255,0.75),inset_-1.5px_-2.5px_1px_0_rgba(83,55,0,0.2),inset_1.5px_1.5px_1px_0_rgba(255,255,255,1)]",
							"hover:[box-shadow:inset_0_0_0_3px_rgba(251,202,106,1),-1px_-1px_0_0_rgba(0,0,0,0.05),1px_1px_0_0_rgba(255,255,255,0.75),inset_-1.5px_-2.5px_1px_0_rgba(83,55,0,0.2),inset_1.5px_1.5px_1px_0_rgba(255,255,255,1)]",
							"focus:outline-none focus:[box-shadow:inset_0_0_0_3px_rgba(147,179,231,1),-1px_-1px_0_0_rgba(0,0,0,0.05),1px_1px_0_0_rgba(255,255,255,0.75),inset_-1.5px_-2.5px_1px_0_rgba(83,55,0,0.2),inset_1.5px_1.5px_1px_0_rgba(255,255,255,1)]",
							"active:bg-linear-to-b active:from-[#e5e4dd] active:to-[#e0e0d7] active:[box-shadow:-1px_-1px_0_0_rgba(0,0,0,0.05),1px_1px_0_0_rgba(255,255,255,0.75),inset_1.5px_2.5px_1px_0_rgba(83,55,0,0.2),inset_-1.5px_-1.5px_1px_0_rgba(255,255,255,1)]",
						),
				props.className,
			)}
			disabled={props.disabled}
			onClick={props.onClick}
			style={{ fontFamily: "Tahoma, sans-serif" }}
			type={props.type ?? "button"}
		>
			<span className="flex items-center justify-center gap-1.5">
				{props.icon}
				{props.children}
			</span>
		</button>
	);
}
