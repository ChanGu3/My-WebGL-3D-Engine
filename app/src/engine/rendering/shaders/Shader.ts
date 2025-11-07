import Engine3D from "../../Engine3D";
import ShaderProgram from "./ShaderProgram";

type source_atr_data = {
    name: string,
    location: number,
}

type source_uni_data = {
    name: string,
    location: WebGLUniformLocation,
}

export type source_type = {
    [key: string]: source_atr_data | source_uni_data;
}

abstract class Shader {
    private shader:WebGLShader;

    protected _source_attribs:source_type = {};
    private shader_type:number;
    private fileName:string = "";

    /*
    *    {filename - no extension just filename}
    */
    constructor (shader_type:number, fileName:string) {
        this.shader = Engine3D.inst.GL.createShader( shader_type ) as WebGLShader;
        this.shader_type = shader_type;
        this.fileName = fileName;
    }

    protected loadShader(source:string):void {
        Engine3D.inst.GL.shaderSource(this.shader, source)
    }

    protected compileShader():void {
        Engine3D.inst.GL.compileShader(this.shader);
    }

    protected addSourceField (atr:string, atrLoc:number):void {
        this._source_attribs[`${atr}`] = { name:`${atr}`, location: atrLoc}; // getting field attribute location can only be done when shader program has been linked
    }

    protected addSourceUniform (atr:string, atrLoc:WebGLUniformLocation):void {
        this._source_attribs[`${atr}`] = { name:`${atr}`, location: atrLoc };
    }

    public abstract findThenAddExistingAttributes(shaderProgram:WebGLProgram);

    /*
     * gets field attribute location otherwise returns -1 if it does not exist, or atr name is reserved for built in
    */
    protected CheckFieldAttribute(shaderProgram:WebGLProgram, atr:string):number {
        const fieldAttribLoc:number = Engine3D.inst.GL.getAttribLocation(shaderProgram, atr);

        let err:number = Engine3D.inst.GL.getError()
        if ( err != 0 ) {
            throw new Error( 'invalid program. Error: ' + err );
        }

        return fieldAttribLoc;
    }

    /*
     * gets uniform attribute location otherwise returns null if it does not exist, or atr name is reserved for built in
    */
    protected CheckUniformAttribute(shaderProgram:WebGLProgram, atr:string):WebGLUniformLocation|null {

        const uniformAttribLoc:WebGLUniformLocation = Engine3D.inst.GL.getUniformLocation(shaderProgram, atr);

        let err = Engine3D.inst.GL.getError()
        if ( err != 0 ) {
            throw new Error( 'invalid program. Error: ' + err );
        }

        return uniformAttribLoc;
    }

    public get instance():WebGLShader {
        return this.shader;
    }

    public get source_attribs():source_type {
        return this._source_attribs;
    }

    /*
        Gets the shader file and places it into the shaders source string in memory.
    */
    // @ts-ignore
    public async getShaderFile_Load_Compile():Promise<void> {
        let fullPath:string = "";
        let shaderName = "";

        switch(this.shader_type) {
            case WebGL2RenderingContext.VERTEX_SHADER:
                fullPath += `/vertex-shaders/${this.fileName}.vert`
                shaderName = "vertex";
                break;
            case WebGL2RenderingContext.FRAGMENT_SHADER:
                fullPath += `/fragment-shaders/${this.fileName}.frag`
                shaderName = "fragment";
                break;

        }

        try {
            const resp:Response = await fetch(fullPath, {
                method: 'GET',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'text/plain',
                }
            });

            if(!resp.ok) {
                throw new Error(`[CAG] - Could Not Find File! Check if your file includes the correct shader extension and that the filename parameter input does not include the extension.`);
            }

            const source = await resp.text();

            this.loadShader(source);
            this.compileShader();
        }
        catch (e) {
            throw new Error(`[CAG] - Something Went Wrong With Retrieving the ${shaderName} Shader at ${fullPath} - error ${e}`);
        }

        return;
    }
}


export default Shader;