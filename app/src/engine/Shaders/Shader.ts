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

    constructor (gl:WebGL2RenderingContext, shader_type:number, shader_source:string) {
        this.shader = gl.createShader( shader_type ) as WebGLShader;
        this.source = shader_source;
        this.loadShader(gl);
        this.compileShader(gl);
    }

    protected loadShader(gl:WebGL2RenderingContext):void {
        gl.shaderSource(this.shader, this.source)
    }

    protected compileShader(gl:WebGL2RenderingContext):void {
        gl.compileShader(this.shader);
    }

    protected addSourceAttribute (gl:WebGL2RenderingContext, shaderProgram:WebGLProgram, atr:string):void {

        this._source_atr[`${atr}`] = { name:`${atr}`, location:():number => { return gl.getAttribLocation(shaderProgram, atr); } }; //getting attribute location can only be done when loaded into shader program
    }

    public get instance():WebGLShader {
        return this.shader;
    }

    public get source_atr():source_atr_type  {
        return this._source_atr;
    }


}


export default Shader;