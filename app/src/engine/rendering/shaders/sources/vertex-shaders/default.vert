#version 300 es
precision mediump float;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

in vec3 coordinates;
in vec2 uv;
in vec3 normal;
out vec2 v_uv;
out vec3 v_normal;
out vec3 v_frag_pos;
void main( void )
{
    vec4 coordinates_model =  model * vec4( coordinates, 1.0 );

    v_normal = normalize(model * vec4(normal,0)).xyz;
    v_frag_pos = coordinates_model.xyz;
    v_uv = uv;

    gl_Position  = projection * view * coordinates_model;
}