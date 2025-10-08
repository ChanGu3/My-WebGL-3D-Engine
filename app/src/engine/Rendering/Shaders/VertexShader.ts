import Shader from "./Shader";
import Engine3D from "../../Engine3D";
import {VertexShaderFieldAttributes} from "./ShaderProgram";

class VertexShader extends Shader {

    private static readonly coor_Source:string =
        `#version 300 es
         precision mediump float;
     
         uniform mat4 modelView;
     
         in vec3 coordinates;
         
         void main( void ) 
         {
            gl_Position = modelView * vec4( coordinates, 1.0 ); // orthographic or perspective (w = 1.0 | orthographic)
         }`;

    private static readonly coor_col_Source:string =
        `#version 300 es
         precision mediump float;
     
         uniform mat4 modelView;
     
         in vec3 coordinates;
         in vec4 color;
         out vec4 v_color;
     
         void main( void ) 
         {
            gl_Position = modelView * vec4( coordinates, 1.0 ); // orthographic or perspective (w = 1.0 | orthographic)
            v_color = color;
         }`;

    constructor(shaderProgram:WebGLProgram, vertexShaderFieldAttributes:VertexShaderFieldAttributes) {
        switch (vertexShaderFieldAttributes) {
            case VertexShaderFieldAttributes.COORDINATES:
                super(Engine3D.inst.GL.VERTEX_SHADER, VertexShader.coor_Source);
                super.addSourceField(shaderProgram, "coordinates");
                super.addSourceUniform(shaderProgram, "modelView");
                break;
            case VertexShaderFieldAttributes.COOR_COL:
                super(Engine3D.inst.GL.VERTEX_SHADER, VertexShader.coor_col_Source);
                super.addSourceField(shaderProgram, "coordinates");
                super.addSourceField(shaderProgram, "color");
                super.addSourceUniform(shaderProgram, "modelView");
                break;
            default:
                throw new Error("shaderProgram for field attributes selected is not supported");
                break;
        }
    }
}

export default VertexShader;