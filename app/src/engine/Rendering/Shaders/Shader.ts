import Engine3D from "../../Engine3D.js";

type source_atr_data = {
    name: string,
    location: () => number,
}

type source_uni_data = {
    name: string,
    location: () => WebGLUniformLocation|null,
}

export type source_type = {
    [key: string]: source_atr_data | source_uni_data;
}

class Shader {
    private shader:WebGLShader;

    protected _source_fields:source_type = {};
    // OpenGL Shading Language Vertex Source
    protected source:string;

    constructor (shader_type:number, shader_source:string) {
        this.shader = Engine3D.inst.GL.createShader( shader_type ) as WebGLShader;
        this.source = shader_source;
        this.loadShader();
        this.compileShader();
    }

    protected loadShader():void {
        Engine3D.inst.GL.shaderSource(this.shader, this.source)
    }

    protected compileShader():void {
        Engine3D.inst.GL.compileShader(this.shader);
    }

    protected addSourceAttribute (shaderProgram:WebGLProgram, atr:string):void {
        this._source_fields[`${atr}`] = { name:`${atr}`, location:():number => { return Engine3D.inst.GL.getAttribLocation(shaderProgram, atr); } }; //getting attribute location can only be done when loaded into shader program
    }

    protected addSourceUniform (shaderProgram:WebGLProgram, atr:string):void {
        this._source_fields[`${atr}`] = { name:`${atr}`, location:():WebGLUniformLocation|null => { return Engine3D.inst.GL.getUniformLocation(shaderProgram, atr); } }; //getting attribute location can only be done when loaded into shader program
    }

    public get instance():WebGLShader {
        return this.shader;
    }

    public get source_fields():source_type {
        return this._source_fields;
    }


}


export default Shader;