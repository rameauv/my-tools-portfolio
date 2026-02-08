import { memo } from "react";

export const Ruler = memo(() => {
	return (
		<div className="relative flex h-6 items-end border-[#d1d1d1] border-b bg-[#ece9d8] px-2 py-1 text-[10px] text-gray-600">
			<div className="absolute right-0 bottom-0 left-0 h-1 overflow-x-hidden border-gray-400 border-t bg-linear-to-b from-gray-200 to-gray-300">
				{/* Ruler marks */}
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						className="absolute border-gray-500 border-l"
						// biome-ignore lint/suspicious/noArrayIndexKey: needed for static ruler marks
						key={i}
						style={{
							left: `${i * 48}px`,
							height: i % 4 === 0 ? "100%" : "50%",
						}}
					/>
				))}
			</div>
		</div>
	);
});
