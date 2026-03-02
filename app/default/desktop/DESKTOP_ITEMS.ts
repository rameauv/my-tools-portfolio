import { appAudioSynthesizer } from "../apps/app-audio-synthesizer";
import { appBackgroundRemover } from "../apps/app-background-remover";
import { appDs } from "../apps/app-ds";
import { appMimeType } from "../apps/app-file-type-detector";
import { appGitHubExplorer } from "../apps/app-github-explorer";
import { appImageConverter } from "../apps/app-image-converter";
import { appLinkedin } from "../apps/app-linkedin";
import { appMandelbrot } from "../apps/app-mandelbrot";
import { appVideoEditor } from "../apps/app-video-editor";
import { appVideoEditorWebcodecs } from "../apps/app-video-editor-webcodecs";
import type { DesktopItem } from "./DesktopItem";

export const DESKTOP_ITEMS: DesktopItem[] = [
	{
		data: {
			id: 1,
			appId: appGitHubExplorer.def.appId,
			icon: appGitHubExplorer.def.iconSrc,
			title: appGitHubExplorer.def.title,
			component: appGitHubExplorer.def.component,
			groupingId: appGitHubExplorer.def.groupingId,
			defaultWidth: appGitHubExplorer.def.defaultWidth,
			defaultHeight: appGitHubExplorer.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 2,
			appId: appLinkedin.def.appId,
			icon: appLinkedin.def.iconSrc,
			title: appLinkedin.def.title,
			component: appLinkedin.def.component,
			groupingId: appLinkedin.def.groupingId,
			defaultWidth: appLinkedin.def.defaultWidth,
			defaultHeight: appLinkedin.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 3,
			appId: appBackgroundRemover.def.appId,
			icon: appBackgroundRemover.def.iconSrc,
			title: appBackgroundRemover.def.title,
			component: appBackgroundRemover.def.component,
			groupingId: appBackgroundRemover.def.groupingId,
			defaultWidth: appBackgroundRemover.def.defaultWidth,
			defaultHeight: appBackgroundRemover.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 4,
			appId: appImageConverter.def.appId,
			icon: appImageConverter.def.iconSrc,
			title: appImageConverter.def.title,
			component: appImageConverter.def.component,
			groupingId: appImageConverter.def.groupingId,
			defaultWidth: appImageConverter.def.defaultWidth,
			defaultHeight: appImageConverter.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 5,
			appId: appMimeType.def.appId,
			icon: appMimeType.def.iconSrc,
			title: appMimeType.def.title,
			component: appMimeType.def.component,
			groupingId: appMimeType.def.groupingId,
			defaultWidth: appMimeType.def.defaultWidth,
			defaultHeight: appMimeType.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 6,
			appId: appDs.def.appId,
			icon: appDs.def.iconSrc,
			title: appDs.def.title,
			component: appDs.def.component,
			groupingId: appDs.def.groupingId,
			defaultWidth: appDs.def.defaultWidth,
			defaultHeight: appDs.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 7,
			appId: appVideoEditor.def.appId,
			icon: appVideoEditor.def.iconSrc,
			title: appVideoEditor.def.title,
			component: appVideoEditor.def.component,
			groupingId: appVideoEditor.def.groupingId,
			defaultWidth: appVideoEditor.def.defaultWidth,
			defaultHeight: appVideoEditor.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 8,
			appId: appVideoEditorWebcodecs.def.appId,
			icon: appVideoEditorWebcodecs.def.iconSrc,
			title: appVideoEditorWebcodecs.def.title,
			component: appVideoEditorWebcodecs.def.component,
			groupingId: appVideoEditorWebcodecs.def.groupingId,
			defaultWidth: appVideoEditorWebcodecs.def.defaultWidth,
			defaultHeight: appVideoEditorWebcodecs.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 9,
			appId: appAudioSynthesizer.def.appId,
			icon: appAudioSynthesizer.def.iconSrc,
			title: appAudioSynthesizer.def.title,
			component: appAudioSynthesizer.def.component,
			groupingId: appAudioSynthesizer.def.groupingId,
			defaultWidth: appAudioSynthesizer.def.defaultWidth,
			defaultHeight: appAudioSynthesizer.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 10,
			appId: appMandelbrot.def.appId,
			icon: appMandelbrot.def.iconSrc,
			title: appMandelbrot.def.title,
			component: appMandelbrot.def.component,
			groupingId: appMandelbrot.def.groupingId,
			defaultWidth: appMandelbrot.def.defaultWidth,
			defaultHeight: appMandelbrot.def.defaultHeight,
		},
		x: 0,
		y: 0,
	},
];
