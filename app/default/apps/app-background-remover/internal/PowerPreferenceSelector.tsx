interface PowerPreferenceSelectorProps {
	powerPreference: "high-performance" | "low-power";
	isPowerPreferenceLocked: boolean;
	onPowerPreferenceChange: (preference: "high-performance" | "low-power") => void;
}

export function PowerPreferenceSelector(props: PowerPreferenceSelectorProps) {
	return (
		<div className="mt-2 flex items-center gap-2">
			<label className="font-medium text-gray-700 text-sm" htmlFor="power-preference-select">
				Power Preference:
			</label>
			<select
				className={`rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					props.isPowerPreferenceLocked ? "cursor-not-allowed bg-gray-50 opacity-60" : ""
				}`}
				disabled={props.isPowerPreferenceLocked}
				id="power-preference-select"
				onChange={(e) => {
					props.onPowerPreferenceChange(e.target.value as "high-performance" | "low-power");
				}}
				value={props.powerPreference}
			>
				<option value="high-performance">High Performance</option>
				<option value="low-power">Low Power</option>
			</select>
			{props.isPowerPreferenceLocked && <span className="text-gray-500 text-xs italic">(Locked)</span>}
		</div>
	);
}
