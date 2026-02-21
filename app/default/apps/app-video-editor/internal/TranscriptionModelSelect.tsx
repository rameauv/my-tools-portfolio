import React from "react";
import { Select } from "./Select";
import { LANGUAGE_IDS } from "./TranscriptionLanguageSelect";

const WHISPER_MODEL_IDS = [
	"onnx-community/whisper-base_timestamped",
	"onnx-community/whisper-medium_timestamped",
	"onnx-community/whisper-large-v3-turbo_timestamped",
] as const;

const MOONSHINE_MODEL_IDS = ["onnx-community/moonshine-tiny-ONNX", "onnx-community/moonshine-base-ONNX"] as const;

const MODEL_OPTIONS = [
	{ id: WHISPER_MODEL_IDS[0], name: "Whisper Base" },
	{ id: WHISPER_MODEL_IDS[1], name: "Whisper Medium" },
	{ id: WHISPER_MODEL_IDS[2], name: "Whisper Large v3 turbo" },
	{ id: MOONSHINE_MODEL_IDS[0], name: "Moonshine Tiny" },
	{ id: MOONSHINE_MODEL_IDS[1], name: "Moonshine Base" },
] as const;

export function formatTranscriptionModelId(modelId: string): string {
	return MODEL_OPTIONS.find((m) => m.id === modelId)?.name ?? modelId;
}

export function getSupportedLanguageIds(modelId: string): string[] {
	if (WHISPER_MODEL_IDS.includes(modelId as (typeof WHISPER_MODEL_IDS)[number])) {
		return [...LANGUAGE_IDS];
	}
	if (MOONSHINE_MODEL_IDS.includes(modelId as (typeof MOONSHINE_MODEL_IDS)[number])) {
		return ["english"];
	}
	return [...LANGUAGE_IDS];
}

export type TranscriptionModelSelectProps = {
	value: string;
	onChange: (value: string) => void;
};

const options = MODEL_OPTIONS.map((m) => ({ value: m.id, label: m.name }));

export const TranscriptionModelSelect = React.memo((props: TranscriptionModelSelectProps) => {
	return <Select onChange={props.onChange} options={options} value={props.value} />;
});
