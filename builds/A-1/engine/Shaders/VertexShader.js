import Shader from "./Shader.js";
class VertexShader extends Shader {
    constructor(gl, shaderProgram) {
        super(gl, gl.VERTEX_SHADER, VertexShader.tempSource);
        super.addSourceAttribute(gl, shaderProgram, "coordinates");
        super.addSourceAttribute(gl, shaderProgram, "color");
    }
}
VertexShader.tempSource = `#version 300 es
         precision mediump float;
     
         in vec3 coordinates;
         in vec4 color;
         out vec4 v_color;
     
         void main( void ) 
         {
            gl_Position = vec4( coordinates, 1.0 ); // orthographic or perspective (w = 1.0 | orthographic)
            v_color = color;
         }`;
export default VertexShader;
//# sourceMappingURL=VertexShader.js.map