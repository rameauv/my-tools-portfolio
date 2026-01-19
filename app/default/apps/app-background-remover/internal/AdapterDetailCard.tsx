import { AdapterLimits } from "./AdapterLimits";
import { AdapterFeatures } from "./AdapterFeatures";

interface AdapterDetailCardProps {
	adapter: any;
	adapterType: 'low-power' | 'high-performance';
}

export function AdapterDetailCard({ adapter, adapterType }: AdapterDetailCardProps) {
	if (!adapter) {
		return null;
	}

	const title = adapterType === 'low-power' ? 'Low-Power Adapter' : 'High-Performance Adapter';
	const powerPreferenceLabel = adapterType === 'low-power' ? 'low-power' : 'high-performance';

	return (
		<div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
			<h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
			<div className="grid grid-cols-2 gap-2 text-sm">
				{adapter.info.vendor && (
					<div>
						<span className="font-medium text-gray-600">Vendor: </span>
						<span className="text-gray-900">{String(adapter.info.vendor)}</span>
					</div>
				)}
				{adapter.info.architecture && (
					<div>
						<span className="font-medium text-gray-600">Architecture: </span>
						<span className="text-gray-900">{String(adapter.info.architecture)}</span>
					</div>
				)}
				{adapter.info.device && (
					<div>
						<span className="font-medium text-gray-600">Device ID: </span>
						<span className="font-mono text-gray-900">{String(adapter.info.device)}</span>
					</div>
				)}
				<div>
					<span className="font-medium text-gray-600">Power Preference: </span>
					<span className="text-gray-900">{powerPreferenceLabel}</span>
				</div>
				{adapter.info.description && (
					<div className="col-span-2">
						<span className="font-medium text-gray-600">Description: </span>
						<span className="text-gray-900">{String(adapter.info.description)}</span>
					</div>
				)}
				{typeof adapter.info.isFallbackAdapter === 'boolean' && (
					<div>
						<span className="font-medium text-gray-600">Is Fallback: </span>
						<span className="text-gray-900">{adapter.info.isFallbackAdapter ? "Yes" : "No"}</span>
					</div>
				)}
				{adapter.features && (
					<div>
						<span className="font-medium text-gray-600">Supported Features: </span>
						<span className="text-gray-900">{adapter.features.size.toLocaleString()}</span>
					</div>
				)}
			</div>
			<AdapterLimits limits={adapter.limits} />
			<AdapterFeatures features={adapter.features} />
		</div>
	);
}
