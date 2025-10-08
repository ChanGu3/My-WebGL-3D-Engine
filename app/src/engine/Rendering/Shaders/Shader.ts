import Engine3D from "../../Engine3D";

type source_atr_data = {
    name: string,
    location: () => number,
}

type source_uni_data = {
    name: string,
    location: () => WebGLUniformLocation,
}

export type source_type = {
    [key: string]: source_atr_data | source_uni_data;
}

class Shader {
    private shader:WebGLShader;

    protected _source_attribs:source_type = {};
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

    protected addSourceField (shaderProgram:WebGLProgram, atr:string):void {
        this._source_attribs[`${atr}`] = { name:`${atr}`,
            location:():number => {
                const fieldAttribLoc = Engine3D.inst.GL.getAttribLocation(shaderProgram, atr);

                if ( fieldAttribLoc == - 1 ) {
                    throw new Error( 'either no field attribute named "' + atr +
                        '" in program or attribute name is reserved/built-in.' )
                }

                let err = Engine3D.inst.GL.getError()
                if ( err != 0 ) {
                    throw new Error( 'invalid program. Error: ' + err );
                }

                return fieldAttribLoc;
            }
        }; // getting field attribute location can only be done when shader program has been linked
    }

    protected addSourceUniform (shaderProgram:WebGLProgram, atr:string):void {
        this._source_attribs[`${atr}`] = { name:`${atr}`,
            location:():WebGLUniformLocation => {
                const uniformAttribLoc = Engine3D.inst.GL.getUniformLocation(shaderProgram, atr);
                if ( uniformAttribLoc == - 1 ) {
                    throw new Error( 'either no uniform attribute named "' + atr +
                        '" in program or attribute name is reserved/built-in.' )
                }

                let err = Engine3D.inst.GL.getError()
                if ( err != 0 ) {
                    throw new Error( 'invalid program. Error: ' + err );
                }

                return uniformAttribLoc;
            }
        }; //getting uniform attribute location can only be done when shader program has been linked
    }

    public get instance():WebGLShader {
        return this.shader;
    }

    public get source_attribs():source_type {
        return this._source_attribs;
    }
}


export default Shader;