import Shader from "./Shader";
import Engine3D from "../../Engine3D";
import {VertexShaderFieldAttributes} from "./ShaderProgram";

class FragmentShader extends  Shader{

    constructor(shaderProgram:WebGLProgram, vertexShaderFieldAttributes:VertexShaderFieldAttributes) {
        switch (vertexShaderFieldAttributes) {
            case VertexShaderFieldAttributes.COORDINATES:
                super(Engine3D.inst.GL.FRAGMENT_SHADER, "coordinates-depth-shader");
                break;
            case VertexShaderFieldAttributes.COOR_COL:
                super(Engine3D.inst.GL.FRAGMENT_SHADER, "coord_color");
                break;
            default:
                throw new Error("shaderProgram for field attributes selected is not supported");
                break;
        }
    }
}

export default FragmentShader;