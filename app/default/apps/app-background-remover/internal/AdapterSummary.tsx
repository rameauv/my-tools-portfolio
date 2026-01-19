import { AdapterName } from "./AdapterName";
import { PowerPreferenceSelector } from "./PowerPreferenceSelector";

interface AdapterSummaryProps {
	adapters: {
		lowPowerAdapter: any | null;
		highPerformanceAdapter: any | null;
	};
	powerPreference: 'high-performance' | 'low-power';
	isPowerPreferenceLocked: boolean;
	onPowerPreferenceChange: (preference: 'high-performance' | 'low-power') => void;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export function AdapterSummary({
	adapters,
	powerPreference,
	isPowerPreferenceLocked,
	onPowerPreferenceChange,
	isExpanded,
	onToggleExpand,
}: AdapterSummaryProps) {
	return (
		<div className="bg-white border border-gray-300 rounded-lg p-3">
			<div className="flex flex-col gap-2">
				<AdapterName adapter={adapters.lowPowerAdapter} label="Low-Power Adapter" />
				<AdapterName adapter={adapters.highPerformanceAdapter} label="High-Performance Adapter" />
				<PowerPreferenceSelector
					powerPreference={powerPreference}
					isPowerPreferenceLocked={isPowerPreferenceLocked}
					onPowerPreferenceChange={onPowerPreferenceChange}
				/>
				<button
					onClick={onToggleExpand}
					className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1 self-start"
				>
					<span>{isExpanded ? "▼" : "▶"}</span>
					<span>{isExpanded ? "Hide" : "Show"} Details</span>
				</button>
			</div>
		</div>
	);
}
