#version 300 es
precision mediump float;

uniform mat4 modelView;
uniform mat4 projection;

in vec3 coordinates;
in vec4 color;
out vec4 v_color;

void main( void )
{
    gl_Position = projection * modelView * vec4( coordinates, 1.0 ); // orthographic or perspective (w = 1.0 | orthographic)
    v_color = color;
}