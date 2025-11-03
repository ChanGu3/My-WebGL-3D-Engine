import VertexShader from "./VertexShader";
import FragmentShader from "./FragmentShader";
import Engine3D from "../../Engine3D";
import mat4, {UniqueMatrix} from "../../linear-algebra/Mat4";
import Shader from "./Shader";
import shader from "./Shader";
import Mat4 from "../../linear-algebra/Mat4";
import Viewport from "../Viewport";
import Mesh from "../Mesh";

type SHADERPROGRAMS = {
    [name:string]: ShaderProgram;
};

/*
 * MUST USE FRAG AND VERT SHADER WITH SAME FILE NAME
*/
class ShaderProgram {
    private static shaderPrograms: SHADERPROGRAMS = {};

    private static readonly coord_count:number = 3;
    private static readonly color_count:number = 4;
    private static readonly uv_count:number = 2;
    private static readonly normal_count:number = 3;

    private _vertexShader:Shader;
    private _fragmentShader:Shader;

    private _program:WebGLProgram;
    private shaderFileName:string;

    constructor(filename:string) {
        this.shaderFileName = filename;
        this._program = Engine3D.inst.GL.createProgram();
        this._vertexShader = new VertexShader(this.shaderFileName);
        this._fragmentShader = new FragmentShader(this.shaderFileName);
    }

    // @ts-ignore
    // TODO make it so that this cant be loaded multiple times
    public static async LoadShaderPrograms(): Promise<void> {
        await ShaderProgram.AddToShaderPrograms('default');
        await ShaderProgram.AddToShaderPrograms('coordinates');
    }

    // @ts-ignore
    public static async AddToShaderPrograms(fileName:string): Promise<void> {
        const newShaderProgram = new ShaderProgram(fileName);
        await newShaderProgram.CompileAttachAndLink();
        ShaderProgram.shaderPrograms[fileName] = newShaderProgram;
    }

    // @ts-ignore
    public async CompileAttachAndLink():Promise<void> {
        try {
            await this._fragmentShader.getShaderFile_Load_Compile();
            await this._vertexShader.getShaderFile_Load_Compile();

            Engine3D.inst.GL.attachShader(this._program, this._vertexShader.instance);
            Engine3D.inst.GL.attachShader(this._program, this._fragmentShader.instance);
            Engine3D.inst.GL.linkProgram(this._program);

            if( !Engine3D.inst.GL.getProgramParameter( this._program, WebGL2RenderingContext.LINK_STATUS ) ) {
                let err = Engine3D.inst.GL.getProgramInfoLog( this._program );
                throw new Error( 'Link error in shader program:\n' + err );
            }

            this._vertexShader.findThenAddExistingAttributes(this._program);

            return;
        } catch (err) {
            throw new Error( err );
        }
    }

    get vertexShader(): Shader {
        return this._vertexShader;
    }

    get ShaderFileName():string {
        return this.shaderFileName;
    }

    get fragmentShader(): Shader {
        return this._fragmentShader;
    }

    get program(): WebGLProgram {
        return this._program;
    }

    public static get ShaderPrograms(): SHADERPROGRAMS {
        return ShaderProgram.shaderPrograms;
    }

    public static UnloadAny():void {
        Engine3D.inst.GL.useProgram(null);
    }

    public Load():void {
        Engine3D.inst.GL.useProgram(this._program);
        this.setModelUniform_Mat4x4(new mat4(UniqueMatrix.Identity)); // model set to the Identity
        this.setViewUniform_Mat4x4(new mat4(UniqueMatrix.Identity)); // view set to the Identity
        this.setProjectionUniform_Mat4x4(new mat4(UniqueMatrix.Identity)); // view set to the Identity
    }

    public setModelUniform_Mat4x4(mat4: mat4):void {
        Engine3D.inst.GL.uniformMatrix4fv( this.vertexShader.source_attribs['model'].location, true, mat4.getData());
    }

    public setViewUniform_Mat4x4(mat4: mat4):void {
        Engine3D.inst.GL.uniformMatrix4fv( this.vertexShader.source_attribs['view'].location, true, mat4.getData());
    }

    public setProjectionUniform_Mat4x4(mat4: mat4):void {
        Engine3D.inst.GL.uniformMatrix4fv( this.vertexShader.source_attribs['projection'].location, true, mat4.getData());
    }

    public setVertexAttributesToBuffer():void {
        let interleavedLength:number = 0;
        interleavedLength = (this._vertexShader.source_attribs['coordinates'] !== undefined) ? interleavedLength + ShaderProgram.coord_count : interleavedLength;
        interleavedLength = (this._vertexShader.source_attribs['color'] !== undefined) ? interleavedLength + ShaderProgram.color_count : interleavedLength;
        interleavedLength = (this._vertexShader.source_attribs['uv'] !== undefined) ? interleavedLength + ShaderProgram.uv_count : interleavedLength;
        interleavedLength = (this._vertexShader.source_attribs['normal'] !== undefined) ? interleavedLength + ShaderProgram.normal_count : interleavedLength;

        let currOffset:number = 0;

        if(this._vertexShader.source_attribs['coordinates'] !== undefined) {
            const cordLoc:number = this.vertexShader.source_attribs['coordinates'].location as number;
            Engine3D.inst.GL.vertexAttribPointer(cordLoc, ShaderProgram.coord_count, WebGL2RenderingContext.FLOAT, false, interleavedLength*Float32Array.BYTES_PER_ELEMENT, 0);
            Engine3D.inst.GL.enableVertexAttribArray(cordLoc);
            currOffset += ShaderProgram.coord_count;
        }

        if(this._vertexShader.source_attribs['color'] !== undefined) {
            const colorLoc:number = this.vertexShader.source_attribs['color'].location as number;
            Engine3D.inst.GL.vertexAttribPointer(colorLoc, ShaderProgram.color_count, WebGL2RenderingContext.FLOAT, false, interleavedLength*Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D.inst.GL.enableVertexAttribArray(colorLoc);
            currOffset += ShaderProgram.color_count;
        }

        if(this._vertexShader.source_attribs['uv'] !== undefined) {
            const uvLoc:number = this.vertexShader.source_attribs['uv'].location as number;
            Engine3D.inst.GL.vertexAttribPointer(uvLoc, ShaderProgram.uv_count, WebGL2RenderingContext.FLOAT, false, interleavedLength*Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D.inst.GL.enableVertexAttribArray(uvLoc);
            currOffset += ShaderProgram.uv_count;
        }

        if(this._vertexShader.source_attribs['normal'] !== undefined) {
            const uvLoc:number = this.vertexShader.source_attribs['normal'].location as number;
            Engine3D.inst.GL.vertexAttribPointer(uvLoc, ShaderProgram.uv_count, WebGL2RenderingContext.FLOAT, false, interleavedLength*Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D.inst.GL.enableVertexAttribArray(uvLoc);
            currOffset += ShaderProgram.normal_count;
        }
    }
}
export default ShaderProgram;