import React, { useEffect, useState } from "react";
import { TranscriptionLanguageSelect } from "./TranscriptionLanguageSelect";
import { getSupportedLanguageIds, TranscriptionModelSelect } from "./TranscriptionModelSelect";
import { TranscriptionPowerPreferenceSelect } from "./TranscriptionPowerPreferenceSelect";

export type TranscriptionIdlePanelProps = {
	file: File | null;
	initialModel?: string;
	initialLanguage?: string;
	initialPowerPreference?: "high-performance" | "low-power";
	onCancel?: () => void;
	onTranscribe: (params: {
		model: string;
		language: string;
		powerPreference: "high-performance" | "low-power";
	}) => void;
};

export const TranscriptionIdlePanel = React.memo((props: TranscriptionIdlePanelProps) => {
	const [selectedModel, setSelectedModel] = useState(props.initialModel ?? "onnx-community/whisper-base_timestamped");
	const [selectedLanguage, setSelectedLanguage] = useState(props.initialLanguage ?? "english");
	const [powerPreference, setPowerPreference] = useState<"high-performance" | "low-power">(
		props.initialPowerPreference ?? "high-performance",
	);

	const supportedLanguageIds = getSupportedLanguageIds(selectedModel);

	useEffect(() => {
		if (!supportedLanguageIds.includes(selectedLanguage)) {
			setSelectedLanguage(supportedLanguageIds[0] ?? "english");
		}
	}, [supportedLanguageIds, selectedLanguage]);

	const handleTranscribe = () => {
		props.onTranscribe({
			model: selectedModel,
			language: selectedLanguage,
			powerPreference,
		});
	};

	return (
		<div className="flex flex-col gap-2">
			<TranscriptionModelSelect onChange={setSelectedModel} value={selectedModel} />
			<TranscriptionPowerPreferenceSelect onChange={setPowerPreference} value={powerPreference} />
			<TranscriptionLanguageSelect
				onChange={setSelectedLanguage}
				supportedLanguageIds={supportedLanguageIds}
				value={selectedLanguage}
			/>
			<div className="flex gap-2">
				{props.onCancel && (
					<button
						className="shrink-0 rounded border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 text-sm transition hover:bg-gray-100"
						onClick={props.onCancel}
						type="button"
					>
						Cancel
					</button>
				)}
				<button
					className="min-w-0 flex-1 rounded bg-blue-600 py-2 font-medium text-sm text-white transition hover:bg-blue-700 disabled:opacity-50"
					disabled={!props.file}
					onClick={handleTranscribe}
					type="button"
				>
					Transcribe Video
				</button>
			</div>
		</div>
	);
});
