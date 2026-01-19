import { AdapterDetailCard } from "./AdapterDetailCard";

interface AdapterDetailsProps {
	adapters: {
		lowPowerAdapter: any | null;
		highPerformanceAdapter: any | null;
	};
}

export function AdapterDetails({ adapters }: AdapterDetailsProps) {
	return (
		<div className="bg-white border border-gray-300 rounded-lg p-4">
			<div className="flex flex-col gap-4">
				<AdapterDetailCard adapter={adapters.lowPowerAdapter} adapterType="low-power" />
				<AdapterDetailCard adapter={adapters.highPerformanceAdapter} adapterType="high-performance" />
			</div>
		</div>
	);
}
