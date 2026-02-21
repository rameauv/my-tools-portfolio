import React, { useCallback, useEffect, useRef } from "react";
import { usePlaybackClock } from "./core/usePlaybackClock";
import { useWebCodecsDecoder } from "./core/useWebCodecsDecoder";
import { VideoEditorControls } from "./VideoEditorControls";

export type VideoEditorViewProps = {
	file: File;
	onReset: () => void;
};

export const VideoEditorView = React.memo((props: VideoEditorViewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const decoder = useWebCodecsDecoder({ file: props.file });
	const playbackClock = usePlaybackClock({
		durationSec: decoder.durationSec,
		getMediaTimeSec: decoder.hasAudio ? decoder.getMediaTimeSec : undefined,
		onPause: decoder.hasAudio ? decoder.pauseAudio : undefined,
		onPlay: decoder.hasAudio ? decoder.playAudioFromTimeSec : undefined,
		onSeek: decoder.hasAudio ? decoder.seekAudioToTimeSec : undefined,
	});
	const renderRafRef = useRef<number | null>(null);

	const drawFrame = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const frame = decoder.getFrameForTimeSec(playbackClock.currentTimeSec);
		if (!frame) return;

		const nextWidth = frame.displayWidth;
		const nextHeight = frame.displayHeight;
		if (canvas.width !== nextWidth) canvas.width = nextWidth;
		if (canvas.height !== nextHeight) canvas.height = nextHeight;

		const context = canvas.getContext("2d");
		if (!context) {
			frame.close();
			return;
		}

		context.drawImage(frame, 0, 0, nextWidth, nextHeight);
		frame.close();
		decoder.reportRenderedFrame();
	}, [decoder, playbackClock.currentTimeSec]);

	useEffect(() => {
		drawFrame();
	}, [drawFrame]);

	useEffect(() => {
		if (!playbackClock.isPlaying) return;

		const tick = () => {
			drawFrame();
			renderRafRef.current = requestAnimationFrame(tick);
		};

		renderRafRef.current = requestAnimationFrame(tick);
		return () => {
			if (renderRafRef.current !== null) cancelAnimationFrame(renderRafRef.current);
			renderRafRef.current = null;
		};
	}, [drawFrame, playbackClock.isPlaying]);

	useEffect(() => {
		if (decoder.durationSec <= 0) return;
		if (playbackClock.currentTimeSec < decoder.durationSec) return;
		playbackClock.pause();
	}, [decoder.durationSec, playbackClock.currentTimeSec, playbackClock.pause]);

	const hasFrames = decoder.frameCount > 0;
	const canPlay = hasFrames && decoder.durationSec > 0;

	const handleTogglePlay = useCallback(() => {
		playbackClock.toggle();
	}, [playbackClock.toggle]);

	const handleSeek = useCallback(
		(timeSec: number) => {
			playbackClock.seek(timeSec);
		},
		[playbackClock.seek],
	);

	const handleResetPlayback = useCallback(() => {
		playbackClock.reset();
		void decoder.pauseAudio();
		decoder.reset();
		props.onReset();
	}, [decoder.pauseAudio, decoder.reset, playbackClock.reset, props.onReset]);

	return (
		<div className="flex h-full min-h-0 flex-col gap-3">
			<div className="relative flex min-h-0 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-black">
				<canvas className="max-h-full max-w-full object-contain" ref={canvasRef} />
				{!hasFrames && (
					<div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
						{decoder.isDecoding ? "Decoding audio/video…" : "Waiting for decoded frames…"}
					</div>
				)}
			</div>

			<VideoEditorControls
				canPlay={canPlay}
				currentTimeSec={playbackClock.currentTimeSec}
				durationSec={decoder.durationSec}
				isPlaying={playbackClock.isPlaying}
				isSyncingAudio={decoder.hasAudio}
				onReset={handleResetPlayback}
				onSeek={handleSeek}
				onTogglePlay={handleTogglePlay}
			/>

			<div className="grid gap-2 rounded-lg border border-gray-200 bg-white p-3 text-gray-700 text-sm md:grid-cols-4">
				<div>
					<div className="font-medium text-gray-500 text-xs uppercase">Fetch</div>
					<div>{decoder.status.fetch}</div>
				</div>
				<div>
					<div className="font-medium text-gray-500 text-xs uppercase">Demux</div>
					<div>{decoder.status.demux}</div>
				</div>
				<div>
					<div className="font-medium text-gray-500 text-xs uppercase">Decode</div>
					<div>{decoder.status.decode}</div>
				</div>
				<div>
					<div className="font-medium text-gray-500 text-xs uppercase">Render</div>
					<div>{decoder.status.render}</div>
				</div>
			</div>
		</div>
	);
});
