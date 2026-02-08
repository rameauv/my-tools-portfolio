import { AdapterFeatures } from "./AdapterFeatures";
import { AdapterLimits } from "./AdapterLimits";
import type { GPUAdapter } from "./GPUAdapter";

interface AdapterDetailCardProps {
	adapter: GPUAdapter | null;
	adapterType: "low-power" | "high-performance";
}

export function AdapterDetailCard(props: AdapterDetailCardProps) {
	if (!props.adapter) {
		return null;
	}

	const title = props.adapterType === "low-power" ? "Low-Power Adapter" : "High-Performance Adapter";
	const powerPreferenceLabel = props.adapterType === "low-power" ? "low-power" : "high-performance";

	return (
		<div className="border-gray-200 border-b pb-4 last:border-b-0 last:pb-0">
			<h3 className="mb-2 font-semibold text-gray-800">{title}</h3>
			<div className="grid grid-cols-2 gap-2 text-sm">
				{props.adapter.info.vendor && (
					<div>
						<span className="font-medium text-gray-600">Vendor: </span>
						<span className="text-gray-900">{String(props.adapter.info.vendor)}</span>
					</div>
				)}
				{props.adapter.info.architecture && (
					<div>
						<span className="font-medium text-gray-600">Architecture: </span>
						<span className="text-gray-900">{String(props.adapter.info.architecture)}</span>
					</div>
				)}
				{props.adapter.info.device && (
					<div>
						<span className="font-medium text-gray-600">Device ID: </span>
						<span className="font-mono text-gray-900">{String(props.adapter.info.device)}</span>
					</div>
				)}
				<div>
					<span className="font-medium text-gray-600">Power Preference: </span>
					<span className="text-gray-900">{powerPreferenceLabel}</span>
				</div>
				{props.adapter.info.description && (
					<div className="col-span-2">
						<span className="font-medium text-gray-600">Description: </span>
						<span className="text-gray-900">{String(props.adapter.info.description)}</span>
					</div>
				)}
				{typeof props.adapter.info.isFallbackAdapter === "boolean" && (
					<div>
						<span className="font-medium text-gray-600">Is Fallback: </span>
						<span className="text-gray-900">{props.adapter.info.isFallbackAdapter ? "Yes" : "No"}</span>
					</div>
				)}
				{props.adapter.features && (
					<div>
						<span className="font-medium text-gray-600">Supported Features: </span>
						<span className="text-gray-900">{props.adapter.features.size.toLocaleString()}</span>
					</div>
				)}
			</div>
			<AdapterLimits limits={props.adapter.limits} />
			<AdapterFeatures features={props.adapter.features} />
		</div>
	);
}
