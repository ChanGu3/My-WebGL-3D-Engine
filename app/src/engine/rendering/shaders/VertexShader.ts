import Shader from "./Shader";
import Engine3D from "../../Engine3D";
import {VertexShaderFieldAttributes} from "./ShaderProgram";

class VertexShader extends Shader {

    constructor(shaderProgram:WebGLProgram, vertexShaderFieldAttributes:VertexShaderFieldAttributes) {
        switch (vertexShaderFieldAttributes) {
            case VertexShaderFieldAttributes.COORDINATES:
                super(Engine3D.inst.GL.VERTEX_SHADER, "coordinates");
                super.addSourceField(shaderProgram, "coordinates");
                super.addSourceUniform(shaderProgram, "model");
                super.addSourceUniform(shaderProgram, "view");
                super.addSourceUniform(shaderProgram, "projection");
                break;
            case VertexShaderFieldAttributes.COOR_COL:
                super(Engine3D.inst.GL.VERTEX_SHADER, "coord_color");
                super.addSourceField(shaderProgram, "coordinates");
                super.addSourceField(shaderProgram, "color");
                super.addSourceUniform(shaderProgram, "model");
                super.addSourceUniform(shaderProgram, "view");
                super.addSourceUniform(shaderProgram, "projection");
                break;
            default:
                throw new Error("[CAG] shaderProgram for field attributes selected is not supported");
                break;
        }
    }
}

export default VertexShader;