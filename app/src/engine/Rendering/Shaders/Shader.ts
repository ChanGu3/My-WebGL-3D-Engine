import Engine3D from "../../Engine3D.js";

type source_atr_data = {
    name: string,
    location: () => number,
}

export type source_atr_type = {
    [key: string]: source_atr_data;
}

class Shader {
    private shader:WebGLShader;

    protected _source_atr:source_atr_type = {};
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
        this._source_atr[`${atr}`] = { name:`${atr}`, location:():number => { return Engine3D.inst.GL.getAttribLocation(shaderProgram, atr); } }; //getting attribute location can only be done when loaded into shader program
    }

    public get instance():WebGLShader {
        return this.shader;
    }

    public get source_atr():source_atr_type  {
        return this._source_atr;
    }


}


export default Shader;