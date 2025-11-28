import Shader from "./Shader";
import Engine3D from "../../Engine3D";

class FragmentShader extends  Shader{

    /*
     *  fileName: file name of the fragment shader
    */
    constructor(fileName:string) {
        super(Engine3D.inst.GL.FRAGMENT_SHADER, fileName);
    }

    public findThenAddExistingAttributes(shaderProgram:WebGLProgram):void {
        let atrFieldNames:string[] = [];
        let atrUniNames:string[] = ['mat_ambient', 'mat_shininess', 'mat_diffuse', 'mat_specular', 'mat_alpha', 'view_pos',
            'directional_light_dir', 'directional_light_color', 'directional_light_count',
            'point_light_pos', 'point_light_color', 'point_light_count', 'point_light_coefficient'];

        atrUniNames.forEach((atrUniName:string):void => {
            let atrUniLoc:WebGLUniformLocation|null = super.CheckUniformAttribute(shaderProgram, atrUniName);
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

export default FragmentShader;