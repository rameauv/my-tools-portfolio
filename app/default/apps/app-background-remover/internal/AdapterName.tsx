interface AdapterNameProps {
	adapter: any;
	label: string;
}

export function AdapterName({ adapter, label }: AdapterNameProps) {
	if (!adapter) {
		return null;
	}

	return (
		<div className="text-sm">
			<span className="font-medium text-gray-700">{label}: </span>
			<span className="text-gray-900">
				{adapter.info.description ||
					`${adapter.info.vendor ?? 'Unknown'} ${adapter.info.architecture ?? 'Unknown'}`}
			</span>
		</div>
	);
}
