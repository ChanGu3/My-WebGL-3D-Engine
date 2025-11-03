#version 300 es
precision mediump float;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

in vec3 coordinates;
in vec4 color;
in vec2 uv;
in vec3 normal;
out vec4 v_color;
out vec2 v_uv;
out vec3 v_normal;
void main( void )
{
    gl_Position = projection * view * model * vec4( coordinates, 1.0 );
    v_color = color;
    v_uv = uv;
    v_normal = normal;
}