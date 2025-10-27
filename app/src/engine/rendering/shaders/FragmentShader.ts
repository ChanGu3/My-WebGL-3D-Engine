import Shader from "./Shader";
import Engine3D from "../../Engine3D";

class FragmentShader extends  Shader{

    /*
     *  fileName: file name of the fragment shader
    */
    constructor(fileName:string) {
        super(Engine3D.inst.GL.FRAGMENT_SHADER, fileName);
    }

    public findThenAddExistingAttributes(shaderProgram:WebGLProgram) {
        throw new Error("Method Does Not Need To Be Called Yet");
    }
}

export default FragmentShader;