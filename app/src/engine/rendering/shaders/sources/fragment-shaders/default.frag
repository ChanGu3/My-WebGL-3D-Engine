#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;
out vec4 f_color;

uniform sampler2D tex_0;

void main( void )
{
    vec4 tex_color = texture( tex_0, v_uv );
    f_color = tex_color * v_color;
}