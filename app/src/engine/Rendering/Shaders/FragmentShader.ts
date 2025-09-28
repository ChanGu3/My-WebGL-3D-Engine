import Shader from "./Shader.js";
import Engine3D from "../../Engine3D.js";

class FragmentShader extends  Shader{
    protected static readonly tempSource:string =
        `#version 300 es
         precision mediump float;
         
         in vec4 v_color;
         out vec4 f_color;
         
         void main( void ) 
         {
            f_color = v_color;
         }`;

    constructor(shaderProgram:WebGLProgram) {
        super(Engine3D.inst.GL.FRAGMENT_SHADER, FragmentShader.tempSource);
    }
}

export default FragmentShader;