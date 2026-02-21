import React from "react";
import { Select } from "./Select";

export type PowerPreference = "high-performance" | "low-power";

const OPTIONS: { value: PowerPreference; label: string }[] = [
	{ value: "high-performance", label: "High Performance" },
	{ value: "low-power", label: "Low Power" },
];

export type TranscriptionPowerPreferenceSelectProps = {
	value: PowerPreference;
	onChange: (value: PowerPreference) => void;
};

export const TranscriptionPowerPreferenceSelect = React.memo((props: TranscriptionPowerPreferenceSelectProps) => {
	return <Select onChange={(v) => props.onChange(v as PowerPreference)} options={OPTIONS} value={props.value} />;
});
