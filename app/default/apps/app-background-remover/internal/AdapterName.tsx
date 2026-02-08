import type { GPUAdapter } from "./GPUAdapter";

interface AdapterNameProps {
	adapter: GPUAdapter | null;
	label: string;
}

export function AdapterName(props: AdapterNameProps) {
	if (!props.adapter) {
		return null;
	}

	return (
		<div className="text-sm">
			<span className="font-medium text-gray-700">{props.label}: </span>
			<span className="text-gray-900">
				{props.adapter.info.description ||
					`${props.adapter.info.vendor ?? "Unknown"} ${props.adapter.info.architecture ?? "Unknown"}`}
			</span>
		</div>
	);
}
