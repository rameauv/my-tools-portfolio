import type { ReactNode } from "react";

interface StatButtonProps {
	children: ReactNode;
	count: number;
}

export function StatButton(props: StatButtonProps) {
	return (
		<button
			className="flex items-center gap-1 rounded-sm border border-gray-400 bg-[#ece9d8] @sm:px-3 px-2 py-1 font-medium @sm:text-sm text-gray-800 text-xs transition-all hover:border-gray-500 hover:bg-white active:border-gray-600 active:bg-gray-200 active:shadow-inner"
			style={{
				boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
			}}
			type="button"
		>
			{props.children}
			<span className="font-semibold">{props.count}</span>
		</button>
	);
}
