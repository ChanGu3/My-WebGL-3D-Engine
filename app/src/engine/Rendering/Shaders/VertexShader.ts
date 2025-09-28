import Shader from "./Shader.js";
import Engine3D from "../../Engine3D.js";

class VertexShader extends Shader {

    private static readonly tempSource:string =
        `#version 300 es
         precision mediump float;
     
         in vec3 coordinates;
         in vec4 color;
         out vec4 v_color;
     
         void main( void ) 
         {
            gl_Position = vec4( coordinates, 1.0 ); // orthographic or perspective (w = 1.0 | orthographic)
            v_color = color;
         }`;

    constructor(shaderProgram:WebGLProgram) {
        super(Engine3D.inst.GL.VERTEX_SHADER, VertexShader.tempSource);
        super.addSourceAttribute(shaderProgram, "coordinates");
        super.addSourceAttribute(shaderProgram, "color");
    }
}

export default VertexShader;