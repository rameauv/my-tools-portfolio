import { Button } from "../../shared/ds/Button";
import { AdapterName } from "./AdapterName";
import type { GPUAdapter } from "./GPUAdapter";
import { PowerPreferenceSelector } from "./PowerPreferenceSelector";

interface AdapterSummaryProps {
	adapters: {
		lowPowerAdapter: GPUAdapter | null;
		highPerformanceAdapter: GPUAdapter | null;
	};
	powerPreference: "high-performance" | "low-power";
	isPowerPreferenceLocked: boolean;
	onPowerPreferenceChange: (preference: "high-performance" | "low-power") => void;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export function AdapterSummary(props: AdapterSummaryProps) {
	return (
		<div className="rounded-lg border border-gray-300 bg-white p-3">
			<div className="flex flex-col gap-2">
				<AdapterName adapter={props.adapters.lowPowerAdapter} label="Low-Power Adapter" />
				<AdapterName adapter={props.adapters.highPerformanceAdapter} label="High-Performance Adapter" />
				<PowerPreferenceSelector
					isPowerPreferenceLocked={props.isPowerPreferenceLocked}
					onPowerPreferenceChange={props.onPowerPreferenceChange}
					powerPreference={props.powerPreference}
				/>
				<Button className="mt-1 self-start" icon={<span>{props.isExpanded ? "▼" : "▶"}</span>} onClick={props.onToggleExpand} type="button">
					{props.isExpanded ? "Hide" : "Show"} Details
				</Button>
			</div>
		</div>
	);
}
