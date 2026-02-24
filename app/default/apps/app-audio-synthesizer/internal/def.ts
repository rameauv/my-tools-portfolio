import type { AppDef } from "../../AppDef";
import { AudioSynthesizer } from "./AudioSynthesizer";

export const def: AppDef = {
	appId: "AUDIO_SYNTHESIZER",
	title: "Audio Synthesizer",
	iconSrc:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%238b5cf6'/%3E%3Cpath d='M30 60L35 45L40 55L45 35L50 65L55 40L60 58L65 42L70 55' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Cpath d='M75 50c0-6 4-10 10-10' stroke='white' stroke-width='5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E",
	component: AudioSynthesizer,
	groupingId: "AUDIO_SYNTHESIZER",
	defaultWidth: 900,
	defaultHeight: 700,
};
