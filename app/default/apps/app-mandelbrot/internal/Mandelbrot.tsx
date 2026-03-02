import { Slider } from "@base-ui/react/slider";
import React, { useRef, useState } from "react";
import { useWebGlDraw, useWebGlPipeline } from "./useWebGl";

function MandelbrotComponent() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [zoom, setZoom] = useState(1);
	const [moveX, setMoveX] = useState(0);
	const [moveY, setMoveY] = useState(0);
	const pipeline = useWebGlPipeline(canvasRef);
	useWebGlDraw(pipeline, { moveX, moveY, zoom });

	return (
		<div className="flex h-full flex-col bg-black">
			<canvas className="min-h-0 w-full flex-1" ref={canvasRef} />
			<div className="flex flex-col gap-3 border-white/10 border-t bg-black/80 p-3 text-white text-xs">
				<div className="flex items-center gap-3">
					<span className="w-16" id="zoom-label">
						Zoom
					</span>
					<Slider.Root
						aria-labelledby="zoom-label"
						className="flex-1"
						max={2000}
						min={1}
						onValueChange={(value) => setZoom(Array.isArray(value) ? value[0] : value)}
						step={0.1}
						value={zoom}
					>
						<Slider.Control className="relative flex h-6 items-center">
							<Slider.Track className="relative h-2 w-full rounded-full bg-white/20">
								<Slider.Indicator className="absolute h-full rounded-full bg-cyan-400" />
								<Slider.Thumb className="block size-4 rounded-full border border-cyan-200 bg-cyan-500 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-300" />
							</Slider.Track>
						</Slider.Control>
					</Slider.Root>
					<span className="w-12 text-right">{zoom.toFixed(1)}x</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="w-16" id="move-x-label">
						Move X
					</span>
					<Slider.Root
						aria-labelledby="move-x-label"
						className="flex-1"
						max={2}
						min={-2}
						onValueChange={(value) => setMoveX(Array.isArray(value) ? value[0] : value)}
						step={0.01}
						value={moveX}
					>
						<Slider.Control className="relative flex h-6 items-center">
							<Slider.Track className="relative h-2 w-full rounded-full bg-white/20">
								<Slider.Indicator className="absolute h-full rounded-full bg-violet-400" />
								<Slider.Thumb className="block size-4 rounded-full border border-violet-200 bg-violet-500 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-300" />
							</Slider.Track>
						</Slider.Control>
					</Slider.Root>
					<span className="w-12 text-right">{moveX.toFixed(2)}</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="w-16" id="move-y-label">
						Move Y
					</span>
					<Slider.Root
						aria-labelledby="move-y-label"
						className="flex-1"
						max={2}
						min={-2}
						onValueChange={(value) => setMoveY(Array.isArray(value) ? value[0] : value)}
						step={0.01}
						value={moveY}
					>
						<Slider.Control className="relative flex h-6 items-center">
							<Slider.Track className="relative h-2 w-full rounded-full bg-white/20">
								<Slider.Indicator className="absolute h-full rounded-full bg-emerald-400" />
								<Slider.Thumb className="block size-4 rounded-full border border-emerald-200 bg-emerald-500 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300" />
							</Slider.Track>
						</Slider.Control>
					</Slider.Root>
					<span className="w-12 text-right">{moveY.toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
}

export const Mandelbrot = React.memo(MandelbrotComponent);
