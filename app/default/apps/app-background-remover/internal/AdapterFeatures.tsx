interface AdapterFeaturesProps {
	features: Set<string> | undefined;
}

export function AdapterFeatures({ features }: AdapterFeaturesProps) {
	if (!features || features.size === 0) {
		return null;
	}

	return (
		<div className="mt-4 pt-4 border-t border-gray-200">
			<h4 className="font-semibold text-gray-800 mb-3 text-sm">Supported Features ({features.size})</h4>
			<div className="flex flex-wrap gap-2 text-xs">
				{Array.from(features).map((feature, index) => (
					<span
						key={index}
						className="px-2 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200 font-mono"
					>
						{String(feature)}
					</span>
				))}
			</div>
		</div>
	);
}
