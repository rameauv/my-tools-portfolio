import React from "react";

interface LanguageBadgeProps {
	language: string | null | undefined;
}

export const LanguageBadge = React.memo((props: LanguageBadgeProps) => {
	if (!props.language) return null;
	return (
		<div className="rounded-sm border border-gray-400 bg-white @sm:px-3 px-2 py-1 font-medium @sm:text-sm text-gray-800 text-xs shadow-sm">
			{props.language}
		</div>
	);
});
