import type * as React from "react";
import { cn } from "~/utils/cn";
import { useWindowContext } from "./WindowContext";

export function WindowSnapping(props: { children: React.ReactNode }) {
	const { snappingSide } = useWindowContext();

	return (
		<div className="relative h-full w-full overflow-hidden">
			<div
				className={cn(
					"pointer-events-none absolute top-2 bottom-2 left-2 z-101 w-[calc(50%-12px)] transition-all duration-300 ease-out",
					snappingSide === "left" ? "translate-x-0 scale-100 opacity-100" : "-translate-x-8 scale-95 opacity-0",
				)}
			>
				<div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-gray-200 shadow-2xl"></div>
			</div>

			<div
				className={cn(
					"pointer-events-none absolute top-2 right-2 bottom-2 z-101 w-[calc(50%-12px)] transition-all duration-300 ease-out",
					snappingSide === "right" ? "translate-x-0 scale-100 opacity-100" : "translate-x-8 scale-95 opacity-0",
				)}
			>
				<div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-gray-200 shadow-2xl"></div>
			</div>

			<div className="relative z-0 h-full w-full">{props.children}</div>
		</div>
	);
}
