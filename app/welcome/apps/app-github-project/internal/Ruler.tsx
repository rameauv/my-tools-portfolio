import { memo } from "react";

export const Ruler = memo(function Ruler() {
	return (
		<div className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 py-1 h-6 flex items-end text-[10px] text-gray-600 relative">
			<div className="absolute left-0 right-0 bottom-0 h-1 bg-linear-to-b from-gray-200 to-gray-300 border-t border-gray-400">
				{/* Ruler marks */}
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						className="absolute border-l border-gray-500"
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
