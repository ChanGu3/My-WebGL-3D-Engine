import Shader from "./Shader";
import Engine3D from "../../Engine3D";

class VertexShader extends Shader {

    /*
     *  fileName: file name of the vertex shader
    */
    constructor(fileName:string) {
        super(Engine3D.inst.GL.VERTEX_SHADER, fileName);
    }

    public findThenAddExistingAttributes(shaderProgram:WebGLProgram):void {
        let atrFieldNames:string[] = ['coordinates', 'color', 'uv', 'normal'];
        let atrUniNames:string[] = ['model', 'projection', 'view'];

        atrUniNames.forEach((atrUniName:string):void => {
            let atrUniLoc:WebGLUniformLocation = super.CheckUniformAttribute(shaderProgram, atrUniName);
            if(atrUniLoc != null) {
                super.addSourceUniform(atrUniName, atrUniLoc);
            }
        })

        atrFieldNames.forEach((atrFieldName:string):void => {
            let atrFieldLoc:number = super.CheckFieldAttribute(shaderProgram, atrFieldName);
            if(atrFieldLoc !== -1) {
                super.addSourceField(atrFieldName, atrFieldLoc);
            }
        })
    }
}

export default VertexShader;