import { type FilterType, FRAGMENT_SOURCE, VERTEX_SOURCE } from "./shaders";

export interface VideoEditorGLUniforms {
	filterType: FilterType;
	intensity: number;
	time: number;
}

export interface VideoEditorGLPipeline {
	render: (uniforms: VideoEditorGLUniforms) => void;
	destroy: () => void;
}

function compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(shader) ?? "unknown";
		gl.deleteShader(shader);
		console.error("Shader compile error:", log);
		return null;
	}
	return shader;
}

function createProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
	const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
	const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
	if (!vs || !fs) return null;
	const program = gl.createProgram();
	if (!program) return null;
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const log = gl.getProgramInfoLog(program) ?? "unknown";
		gl.deleteProgram(program);
		console.error("Program link error:", log);
		return null;
	}
	return program;
}

function createQuadBuffer(gl: WebGL2RenderingContext): WebGLBuffer | null {
	const buffer = gl.createBuffer();
	if (!buffer) return null;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	return buffer;
}

function createVideoTexture(gl: WebGL2RenderingContext): WebGLTexture | null {
	const texture = gl.createTexture();
	if (!texture) return null;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	return texture;
}

function updateVideoTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, video: HTMLVideoElement): void {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
}

export function resizeCanvasToMatchVideo(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
	const w = video.videoWidth;
	const h = video.videoHeight;
	if (w <= 0 || h <= 0) return;
	const dpr = Math.min(2, window.devicePixelRatio ?? 1);
	canvas.width = Math.floor(w * dpr);
	canvas.height = Math.floor(h * dpr);
	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;
}

export function createVideoEditorPipeline(
	canvas: HTMLCanvasElement,
	video: HTMLVideoElement,
): VideoEditorGLPipeline | null {
	const glOrNull = canvas.getContext("webgl2", { alpha: false, antialias: false });
	if (!glOrNull) {
		console.error("WebGL2 not supported");
		return null;
	}
	const gl: WebGL2RenderingContext = glOrNull;

	const program = createProgram(gl, VERTEX_SOURCE, FRAGMENT_SOURCE);
	const quadBuffer = createQuadBuffer(gl);
	const textureOrNull = createVideoTexture(gl);
	if (!program || !quadBuffer || !textureOrNull) {
		if (program) gl.deleteProgram(program);
		if (quadBuffer) gl.deleteBuffer(quadBuffer);
		if (textureOrNull) gl.deleteTexture(textureOrNull);
		return null;
	}
	const texture: WebGLTexture = textureOrNull;

	const positionLoc = gl.getAttribLocation(program, "a_position");
	const uTexture = gl.getUniformLocation(program, "u_texture");
	const uTime = gl.getUniformLocation(program, "u_time");
	const uIntensity = gl.getUniformLocation(program, "u_intensity");
	const uFilterType = gl.getUniformLocation(program, "u_filterType");

	function render(uniforms: VideoEditorGLUniforms): void {
		if (video.readyState < 2) return;
		updateVideoTexture(gl, texture, video);
		gl.viewport(0, 0, canvas.width, canvas.height);
		// biome-ignore lint/correctness/useHookAtTopLevel: WebGL API method, not a React hook
		gl.useProgram(program);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(uTexture, 0);
		gl.uniform1f(uTime, uniforms.time);
		gl.uniform1f(uIntensity, uniforms.intensity);
		gl.uniform1i(uFilterType, uniforms.filterType);
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	function destroy(): void {
		gl.deleteProgram(program);
		gl.deleteBuffer(quadBuffer);
		gl.deleteTexture(texture);
	}

	return { render, destroy };
}
