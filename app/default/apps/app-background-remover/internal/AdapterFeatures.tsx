interface AdapterFeaturesProps {
	features: Set<string> | undefined;
}

export function AdapterFeatures(props: AdapterFeaturesProps) {
	if (!props.features || props.features.size === 0) {
		return null;
	}

	return (
		<div className="mt-4 border-gray-200 border-t pt-4">
			<h4 className="mb-3 font-semibold text-gray-800 text-sm">Supported Features ({props.features.size})</h4>
			<div className="flex flex-wrap gap-2 text-xs">
				{Array.from(props.features).map((feature) => (
					<span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-blue-800" key={feature}>
						{String(feature)}
					</span>
				))}
			</div>
		</div>
	);
}
