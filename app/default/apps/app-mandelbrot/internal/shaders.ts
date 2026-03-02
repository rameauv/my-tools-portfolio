export const vertexShaderSource = `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_center;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 plane = vec2((uv.x * 4.0 - 2.0) * aspect, uv.y * 4.0 - 2.0);
  vec2 ab = plane / u_zoom + u_center;
  vec2 c = vec2(ab.x, ab.y);
  const int maxIterations = 100;

  int n = 0;

  for (int i = 0; i < maxIterations; i++) {
    float aa = ab.x * ab.x - ab.y * ab.y;
    float bb = 2.0 * ab.x * ab.y;
    ab = vec2(aa + c.x, bb + c.y);

    if (dot(ab, ab) > 4.0) {
      break;
    }
    n++;
  }

  float brightness = float(n) / float(maxIterations);
  if (n == maxIterations) {
    brightness = 0.0;
  }
  vec3 color = vec3(brightness, brightness, brightness);
  outColor = vec4(color, 1.0);
}
`;
