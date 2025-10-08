import Shader from "./Shader";
import Engine3D from "../../Engine3D";
import {VertexShaderFieldAttributes} from "./ShaderProgram";

class FragmentShader extends  Shader{
    protected static readonly coor_Source:string =
        `#version 300 es
         precision mediump float;
         
         out vec4 f_color;
         
         void main( void ) 
         {
            f_color = vec4( vec3(gl_FragCoord.z), 1.0 );
         }`;

    protected static readonly coor_col_Source:string =
        `#version 300 es
         precision mediump float;
         
         in vec4 v_color;
         out vec4 f_color;
         
         void main( void ) 
         {
            f_color = v_color;
         }`;

    constructor(shaderProgram:WebGLProgram, vertexShaderFieldAttributes:VertexShaderFieldAttributes) {
        switch (vertexShaderFieldAttributes) {
            case VertexShaderFieldAttributes.COORDINATES:
                super(Engine3D.inst.GL.FRAGMENT_SHADER, FragmentShader.coor_Source);
                break;
            case VertexShaderFieldAttributes.COOR_COL:
                super(Engine3D.inst.GL.FRAGMENT_SHADER, FragmentShader.coor_col_Source);
                break;
            default:
                throw new Error("shaderProgram for field attributes selected is not supported");
                break;
        }
    }
}

export default FragmentShader;