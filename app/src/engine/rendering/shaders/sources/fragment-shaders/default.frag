#version 300 es
precision mediump float;

uniform vec3 view_pos;

uniform vec3 sun_dir;
uniform vec3 sun_color;

uniform float mat_ambient;
uniform float mat_diffuse;
uniform float mat_specular;
uniform float mat_shininess;
uniform sampler2D tex_0;

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_frag_pos;

out vec4 f_color;

vec3 spec_color(vec3 normal_dir, float mat_specular, float mat_shininess, vec3 view_pos, vec3 v_frag_pos, vec3 light_dir, vec3 light_color)
{
    vec3 normal_dir_NORM = normalize(normal_dir);
    vec3 view_dir = normalize(view_pos - v_frag_pos.xyz);
    vec3 light_dir_NORM = normalize(light_dir);

    float cos_light_surf_normal = dot(normal_dir_NORM, light_dir_NORM);
    vec3 reflection_dir = 2.0 * cos_light_surf_normal * normal_dir_NORM - light_dir_NORM;

    float base_specular = pow(max(dot(reflection_dir, view_dir), 0.0), mat_shininess);
    return mat_specular * base_specular * light_color;
}

vec3 diff_color(vec3 v_normal, float mat_diffuse, vec3 light_dir, vec3 light_color)
{
    return  mat_diffuse * light_color * max(dot(v_normal, light_dir), 0.0);
}

void main( void )
{
    vec4 tex_color = texture( tex_0, v_uv );
    vec4 ambient = vec4(mat_ambient, mat_ambient, mat_ambient, 1);
    vec4 diffuse = vec4(diff_color(v_normal, mat_diffuse, -sun_dir, sun_color), 1);
    vec4 specular = vec4(spec_color(v_normal, mat_specular, mat_shininess, view_pos, v_frag_pos, -sun_dir, sun_color), 1);
    f_color = tex_color * (ambient + diffuse + specular);
}
