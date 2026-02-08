import { useState } from "react";
import { AdapterDetails } from "./AdapterDetails";
import { AdapterSummary } from "./AdapterSummary";
import type { GPUAdapter } from "./GPUAdapter";

interface GpuInfoProps {
	adapters:
		| {
				lowPowerAdapter: GPUAdapter | null;
				highPerformanceAdapter: GPUAdapter | null;
		  }
		| null
		| undefined;
	powerPreference: "high-performance" | "low-power";
	isPowerPreferenceLocked: boolean;
	onPowerPreferenceChange: (preference: "high-performance" | "low-power") => void;
}

export function GpuInfo(props: GpuInfoProps) {
	const [isAdapterDetailsExpanded, setIsAdapterDetailsExpanded] = useState(false);

	if (
		props.adapters === null ||
		props.adapters === undefined ||
		(!props.adapters.lowPowerAdapter && !props.adapters.highPerformanceAdapter)
	) {
		return null;
	}

	return (
		<>
			<AdapterSummary
				adapters={props.adapters}
				isExpanded={isAdapterDetailsExpanded}
				isPowerPreferenceLocked={props.isPowerPreferenceLocked}
				onPowerPreferenceChange={props.onPowerPreferenceChange}
				onToggleExpand={() => setIsAdapterDetailsExpanded(!isAdapterDetailsExpanded)}
				powerPreference={props.powerPreference}
			/>
			{isAdapterDetailsExpanded && <AdapterDetails adapters={props.adapters} />}
		</>
	);
}
