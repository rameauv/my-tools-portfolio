export const VERTEX_SOURCE = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SOURCE = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_intensity;
uniform int u_filterType;
in vec2 v_uv;
out vec4 outColor;

void main() {
  vec4 tex = texture(u_texture, v_uv);
  vec3 color = tex.rgb;

  if (u_filterType == 1) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(color, vec3(g, g, g), u_intensity);
  } else if (u_filterType == 2) {
    vec3 sepia = vec3(
      dot(color, vec3(0.393, 0.769, 0.189)),
      dot(color, vec3(0.349, 0.686, 0.168)),
      dot(color, vec3(0.272, 0.534, 0.131))
    );
    color = mix(color, sepia, u_intensity);
  } else if (u_filterType == 3) {
    vec2 c = v_uv - 0.5;
    float d = length(c) * 2.0;
    float v = 1.0 - smoothstep(0.5, 1.2, d) * u_intensity;
    color = color * v;
  }

  outColor = vec4(color, tex.a);
}
`;

export type FilterType = 0 | 1 | 2 | 3;

export const FILTER_NONE: FilterType = 0;
export const FILTER_GRAYSCALE: FilterType = 1;
export const FILTER_SEPIA: FilterType = 2;
export const FILTER_VIGNETTE: FilterType = 3;
