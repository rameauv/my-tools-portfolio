import { useEffect, useState } from "react";
import { fragmentShaderSource, vertexShaderSource } from "./shaders";

interface WebGlPipeline {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	program: WebGLProgram;
	positionBuffer: WebGLBuffer;
	positionLocation: number;
	resolutionLocation: WebGLUniformLocation;
	zoomLocation: WebGLUniformLocation;
	centerLocation: WebGLUniformLocation;
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error("Failed to create shader");
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error";
		gl.deleteShader(shader);
		throw new Error(info);
	}

	return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	const program = gl.createProgram();

	if (!program) {
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		throw new Error("Failed to create WebGL program");
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program) ?? "Unknown program link error";
		gl.deleteProgram(program);
		throw new Error(info);
	}

	return program;
}

export function useWebGlPipeline(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const [pipeline, setPipeline] = useState<WebGlPipeline | null>(null);

	useEffect(
		function setupPipeline() {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const gl = canvas.getContext("webgl2");
			if (!gl) return;

			let program: WebGLProgram | null = null;
			let positionBuffer: WebGLBuffer | null = null;

			try {
				program = createProgram(gl);
				const positionLocation = gl.getAttribLocation(program, "a_position");
				const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
				const zoomLocation = gl.getUniformLocation(program, "u_zoom");
				const centerLocation = gl.getUniformLocation(program, "u_center");

				if (positionLocation < 0 || !resolutionLocation || !zoomLocation || !centerLocation) {
					throw new Error("Shader attribute/uniform not found");
				}

				positionBuffer = gl.createBuffer();
				if (!positionBuffer) {
					throw new Error("Failed to create vertex buffer");
				}

				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

				setPipeline({
					canvas,
					gl,
					program,
					positionBuffer,
					positionLocation,
					resolutionLocation,
					zoomLocation,
					centerLocation,
				});
			} catch (error) {
				console.error("Failed to initialize Mandelbrot app WebGL pipeline", error);
				if (program) {
					gl.deleteProgram(program);
				}
				if (positionBuffer) {
					gl.deleteBuffer(positionBuffer);
				}
			}

			return function cleanupPipeline() {
				setPipeline(null);
				if (program) {
					gl.deleteProgram(program);
				}
				if (positionBuffer) {
					gl.deleteBuffer(positionBuffer);
				}
			};
		},
		[canvasRef],
	);

	return pipeline;
}

interface CameraControlValues {
	zoom: number;
	moveX: number;
	moveY: number;
}

export function useWebGlDraw(pipeline: WebGlPipeline | null, controls: CameraControlValues) {
	useEffect(
		function setupDrawLoop() {
			if (!pipeline) return;

			const {
				canvas,
				gl,
				program,
				positionBuffer,
				positionLocation,
				resolutionLocation,
				zoomLocation,
				centerLocation,
			} = pipeline;
			let frameId = 0;
			// biome-ignore lint/correctness/useHookAtTopLevel: this is not react
			gl.useProgram(program);

			function render() {
				const dpr = window.devicePixelRatio || 1;
				const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
				const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width;
					canvas.height = height;
				}

				gl.viewport(0, 0, canvas.width, canvas.height);
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.enableVertexAttribArray(positionLocation);
				gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
				gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
				gl.uniform1f(zoomLocation, controls.zoom);
				gl.uniform2f(centerLocation, controls.moveX, controls.moveY);
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

				frameId = window.requestAnimationFrame(render);
			}

			render();

			return function cleanupDrawLoop() {
				if (frameId !== 0) {
					window.cancelAnimationFrame(frameId);
				}
			};
		},
		[controls.moveX, controls.moveY, controls.zoom, pipeline],
	);
}
