import VertexShader from "./VertexShader";
import FragmentShader from "./FragmentShader";
import Engine3D from "../../Engine3D";
import mat4, {UniqueMatrix} from "../../linear-algebra/Mat4";
import Shader from "./Shader";
import shader from "./Shader";
import Mat4 from "../../linear-algebra/Mat4";
import Viewport from "../Viewport";

export enum VertexShaderFieldAttributes {
    NONE = 0,
    COORDINATES = 1,
    COLOR = 2,
    COOR_COL = COORDINATES|COLOR,
}

class ShaderProgram {
    private static coord_count:number = 3;
    private static color_count:number = 4;


    private _vertexShader:Shader;
    private _fragmentShader:Shader;

    private _program:WebGLProgram;
    private _vertexShaderFieldAttributes:VertexShaderFieldAttributes;

    constructor(vertexShaderFieldAttributes:VertexShaderFieldAttributes) {
        this._vertexShaderFieldAttributes = vertexShaderFieldAttributes;
        this._program = Engine3D.inst.GL.createProgram();
        this._vertexShader = new VertexShader(this._program, vertexShaderFieldAttributes);
        this._fragmentShader = new FragmentShader(this._program, vertexShaderFieldAttributes);
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

            return;
        } catch (err) {
            throw new Error( err );
        }
    }

    get vertexShader(): Shader {
        return this._vertexShader;
    }

    get vertexShaderFieldAttributes():VertexShaderFieldAttributes {
        return this._vertexShaderFieldAttributes;
    }

    get fragmentShader(): Shader {
        return this._fragmentShader;
    }

    get program(): WebGLProgram {
        return this._program;
    }

    public static UnloadAny():void {
        Engine3D.inst.GL.useProgram(null);
    }

    public Load():void {
        Engine3D.inst.GL.useProgram(this._program);
        this.setModelUniform_Mat4x4(new mat4(UniqueMatrix.Identity)); // model view set to the Identity
    }

    public setModelUniform_Mat4x4(mat4: mat4):void {
        const loc:WebGLUniformLocation = this.vertexShader.source_attribs['modelView'].location();
        Engine3D.inst.GL.uniformMatrix4fv( loc, true, mat4.getData());
    }

    public setProjectionUniform_Mat4x4(mat4: mat4):void {
        const loc:WebGLUniformLocation = this.vertexShader.source_attribs['projection'].location();
        Engine3D.inst.GL.uniformMatrix4fv( loc, true, mat4.getData());
    }

    public setVertexAttributesToBuffer():void {
        let interleavedLength:number = 0;
        interleavedLength = (VertexShaderFieldAttributes.COORDINATES & this._vertexShaderFieldAttributes) ? interleavedLength + ShaderProgram.coord_count : interleavedLength;
        interleavedLength = (VertexShaderFieldAttributes.COLOR & this._vertexShaderFieldAttributes) ? interleavedLength + 4 : interleavedLength;

        let currOffset:number = 0;

        if(VertexShaderFieldAttributes.COORDINATES & this._vertexShaderFieldAttributes) {
            const cordLoc:number = this.vertexShader.source_attribs['coordinates'].location() as number;
            Engine3D.inst.GL.vertexAttribPointer(cordLoc, ShaderProgram.coord_count, WebGL2RenderingContext.FLOAT, false, interleavedLength*Float32Array.BYTES_PER_ELEMENT, 0);
            Engine3D.inst.GL.enableVertexAttribArray(cordLoc);
            currOffset += ShaderProgram.coord_count;
        }

        if(VertexShaderFieldAttributes.COLOR & this._vertexShaderFieldAttributes) {
            const colorLoc:number = this.vertexShader.source_attribs['color'].location() as number;
            Engine3D.inst.GL.vertexAttribPointer(colorLoc, ShaderProgram.color_count, WebGL2RenderingContext.FLOAT, false, interleavedLength*Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D.inst.GL.enableVertexAttribArray(colorLoc);
            currOffset += ShaderProgram.color_count;
        }
    }
}

export default ShaderProgram;