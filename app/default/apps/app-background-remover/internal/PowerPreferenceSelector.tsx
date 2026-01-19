interface PowerPreferenceSelectorProps {
	powerPreference: 'high-performance' | 'low-power';
	isPowerPreferenceLocked: boolean;
	onPowerPreferenceChange: (preference: 'high-performance' | 'low-power') => void;
}

export function PowerPreferenceSelector({
	powerPreference,
	isPowerPreferenceLocked,
	onPowerPreferenceChange,
}: PowerPreferenceSelectorProps) {
	return (
		<div className="flex items-center gap-2 mt-2">
			<label htmlFor="power-preference-select" className="text-sm font-medium text-gray-700">
				Power Preference:
			</label>
			<select
				id="power-preference-select"
				value={powerPreference}
				disabled={isPowerPreferenceLocked}
				onChange={(e) => {
					onPowerPreferenceChange(e.target.value as 'high-performance' | 'low-power');
				}}
				className={`text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
					isPowerPreferenceLocked ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''
				}`}
			>
				<option value="high-performance">High Performance</option>
				<option value="low-power">Low Power</option>
			</select>
			{isPowerPreferenceLocked && (
				<span className="text-xs text-gray-500 italic">(Locked)</span>
			)}
		</div>
	);
}
