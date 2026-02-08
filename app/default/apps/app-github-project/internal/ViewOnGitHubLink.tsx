import { ExternalLink } from "lucide-react";

export function ViewOnGitHubLink(props: { href: string }) {
	return (
		<a
			className="flex shrink-0 items-center @sm:gap-2 gap-1.5 rounded-sm border border-[#1c56c5] bg-linear-to-b from-[#3c81f0] to-[#245edb] @sm:px-4 px-3 @sm:py-1.5 py-1 font-semibold @sm:text-sm text-white text-xs shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] transition-all hover:from-[#4c91ff] hover:to-[#346efb] active:border-[#163f8c] active:from-[#1e52b7] active:to-[#163f8c] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"
			href={props.href}
			rel="noopener noreferrer"
			style={{ fontFamily: "Tahoma, sans-serif" }}
			target="_blank"
		>
			View on GitHub
			<ExternalLink className="@sm:h-3.5 h-3 @sm:w-3.5 w-3" size={14} />
		</a>
	);
}
