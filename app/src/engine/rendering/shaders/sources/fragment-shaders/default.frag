#version 300 es
precision mediump float;

uniform vec3 view_pos;

// Point Lighting
const int MAX_POINT_LIGHTS = 16;
uniform vec3 point_light_pos[MAX_POINT_LIGHTS];
uniform vec3 point_light_color[MAX_POINT_LIGHTS];
uniform float point_light_coefficient[MAX_POINT_LIGHTS];
uniform int point_light_count;

// Directional Lighting
const int MAX_DIRECTIONAL_LIGHTS = 16;
uniform vec3 directional_light_dir[MAX_DIRECTIONAL_LIGHTS];
uniform vec3 directional_light_color[MAX_DIRECTIONAL_LIGHTS];
uniform int directional_light_count;

// Material Data
uniform float mat_ambient;
uniform float mat_diffuse;
uniform float mat_specular;
uniform float mat_shininess;
uniform sampler2D tex_0;

// Fragment Data
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_frag_pos;

// Resulting Factors
out vec4 f_color;

/*
vec3 directional_diffuse_color(vec3 v_normal, float mat_diffuse, vec3 light_dir, vec3 light_color)
{
    return  mat_diffuse * light_color * max(dot(v_normal, light_dir), 0.0);
}

vec3 directional_specular_color(vec3 v_normal, float mat_specular, float mat_shininess, vec3 view_pos, vec3 v_frag_pos, vec3 light_dir, vec3 light_color)
{
    vec3 normal_dir_NORM = normalize(v_normal);
    vec3 view_dir = normalize(view_pos - v_frag_pos);
    vec3 light_dir_NORM = normalize(light_dir);

    float cos_light_surf_normal = dot(normal_dir_NORM, light_dir_NORM);
    vec3 reflection_dir = 2.0 * cos_light_surf_normal * normal_dir_NORM - light_dir_NORM;

    float base_specular = pow(max(dot(reflection_dir, view_dir), 0.0), mat_shininess);
    return mat_specular * base_specular * light_color;
}
*/

vec3 total_directional_diffuse_color(vec3 directional_light_dir[MAX_DIRECTIONAL_LIGHTS], vec3 directional_light_color[MAX_DIRECTIONAL_LIGHTS], int directional_light_count, vec3 v_normal, float mat_diffuse)
{
    vec3 accum_diffuse_color = vec3(0,0,0);
    for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
        if (i == directional_light_count) break;
        accum_diffuse_color += mat_diffuse * directional_light_color[i] * max(dot(v_normal, -directional_light_dir[i]), 0.0);
    }
    return accum_diffuse_color;
}

vec3 total_directional_specular_color(vec3 directional_light_dir[MAX_DIRECTIONAL_LIGHTS], vec3 directional_light_color[MAX_DIRECTIONAL_LIGHTS], int directional_light_count, vec3 v_normal, float mat_specular, float mat_shininess, vec3 view_pos, vec3 v_frag_pos)
{
    vec3 normal_dir_NORM = normalize(v_normal);
    vec3 view_dir = normalize(view_pos - v_frag_pos);

    vec3 accum_specular_color = vec3(0,0,0);
    for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
        if (i == directional_light_count) break;
        vec3 light_dir_NORM = normalize(-directional_light_dir[i]);

        float cos_light_surf_normal = dot(normal_dir_NORM, light_dir_NORM);
        vec3 reflection_dir = 2.0 * cos_light_surf_normal * normal_dir_NORM - light_dir_NORM;

        float base_specular = pow(max(dot(reflection_dir, view_dir), 0.0), mat_shininess);
        accum_specular_color += mat_specular * base_specular * directional_light_color[i];
    }
    return accum_specular_color;
}

vec3 total_point_diffuse_specular_color(vec3 point_light_pos[MAX_POINT_LIGHTS], vec3 point_light_color[MAX_POINT_LIGHTS], float point_light_coefficient[MAX_POINT_LIGHTS], int point_light_count, vec3 view_pos, vec3 v_frag_pos, vec3 v_normal, float mat_diffuse, float mat_specular, float mat_shininess)
{
    vec3 normal_dir = normalize(v_normal);
    vec3 view_dir = normalize(view_pos - v_frag_pos);

    vec3 accum_color = vec3(0,0,0);
    vec3 diffuse = vec3(0,0,0);
    vec3 specular = vec3(0,0,0);
    for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
        if (i == point_light_count) break;
        vec3 light_dir_plus_mag = point_light_pos[i] - v_frag_pos;
        float light_mag = length(light_dir_plus_mag);
        vec3 light_dir = normalize(light_dir_plus_mag);

        diffuse = mat_diffuse * point_light_color[i] * max(dot(normal_dir, light_dir), 0.0);

        float cos_light_surf_normal = dot(normal_dir, light_dir);
        vec3 reflection_dir = 2.0 * cos_light_surf_normal * normal_dir - light_dir;

        float base_specular = pow(max(dot(reflection_dir, view_dir), 0.0), mat_shininess);
        specular = mat_specular * base_specular * point_light_color[i];

        float attenuation = (1.0 / (point_light_coefficient[i] * pow(light_mag,2.0)));
        accum_color += ((diffuse + specular) * attenuation);
    }
    return accum_color;
}

void main( void )
{
    vec4 tex_color = texture( tex_0, v_uv );
    vec4 ambient = vec4(mat_ambient, mat_ambient, mat_ambient, 1);

    vec4 total_directional_diffuse = vec4(total_directional_diffuse_color(directional_light_dir, directional_light_color, directional_light_count, v_normal, mat_diffuse), 1.0);
    vec4 total_directional_specular = vec4(total_directional_specular_color(directional_light_dir, directional_light_color, directional_light_count, v_normal, mat_specular, mat_shininess, view_pos, v_frag_pos), 1.0);
    vec4 total_point_color = vec4(total_point_diffuse_specular_color(point_light_pos, point_light_color, point_light_coefficient, point_light_count, view_pos, v_frag_pos, v_normal, mat_diffuse, mat_specular, mat_shininess), 1);
    f_color = tex_color * (ambient + total_directional_diffuse + total_directional_specular + total_point_color);
}
