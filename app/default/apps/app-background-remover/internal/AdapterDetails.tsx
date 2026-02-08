import { AdapterDetailCard } from "./AdapterDetailCard";
import type { GPUAdapter } from "./GPUAdapter";

interface AdapterDetailsProps {
	adapters: {
		lowPowerAdapter: GPUAdapter | null;
		highPerformanceAdapter: GPUAdapter | null;
	};
}

export function AdapterDetails(props: AdapterDetailsProps) {
	return (
		<div className="rounded-lg border border-gray-300 bg-white p-4">
			<div className="flex flex-col gap-4">
				<AdapterDetailCard adapter={props.adapters.lowPowerAdapter} adapterType="low-power" />
				<AdapterDetailCard adapter={props.adapters.highPerformanceAdapter} adapterType="high-performance" />
			</div>
		</div>
	);
}
