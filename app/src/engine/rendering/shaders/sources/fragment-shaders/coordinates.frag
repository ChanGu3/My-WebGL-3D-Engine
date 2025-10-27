#version 300 es
precision mediump float;

out vec4 f_color;

void main( void )
{
    f_color = vec4( vec3(gl_FragCoord.z), 1.0 );
}