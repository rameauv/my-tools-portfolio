import { useState } from "react";
import { AdapterSummary } from "./AdapterSummary";
import { AdapterDetails } from "./AdapterDetails";

interface GpuInfoProps {
	adapters: {
		lowPowerAdapter: any | null;
		highPerformanceAdapter: any | null;
	} | null | undefined;
	powerPreference: 'high-performance' | 'low-power';
	isPowerPreferenceLocked: boolean;
	onPowerPreferenceChange: (preference: 'high-performance' | 'low-power') => void;
}

export function GpuInfo({
	adapters,
	powerPreference,
	isPowerPreferenceLocked,
	onPowerPreferenceChange,
}: GpuInfoProps) {
	const [isAdapterDetailsExpanded, setIsAdapterDetailsExpanded] = useState(false);

	if (adapters === null || adapters === undefined || (!adapters.lowPowerAdapter && !adapters.highPerformanceAdapter)) {
		return null;
	}

	return (
		<>
			<AdapterSummary
				adapters={adapters}
				powerPreference={powerPreference}
				isPowerPreferenceLocked={isPowerPreferenceLocked}
				onPowerPreferenceChange={onPowerPreferenceChange}
				isExpanded={isAdapterDetailsExpanded}
				onToggleExpand={() => setIsAdapterDetailsExpanded(!isAdapterDetailsExpanded)}
			/>
			{isAdapterDetailsExpanded && <AdapterDetails adapters={adapters} />}
		</>
	);
}
