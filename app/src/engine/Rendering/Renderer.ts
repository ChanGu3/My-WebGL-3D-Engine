import Engine3D from "../Engine3D.js";
import ShaderProgram from "./Shaders/ShaderProgram.js";
import mat4, {UniqueMatrix} from "../LinearAlgebra/Mat4.js";
import Buffers from "../Buffers.js";
import Time from "../Time.js";

//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    private static updateTimeEvent:Event = new Event("updateTimeEvent");

    private static readonly ndcInterleavedLength = 3;
    private static readonly colorInterleavedLength = 4;
    private static readonly interleavedLength = Renderer.ndcInterleavedLength + Renderer.colorInterleavedLength;
    private static readonly bytesOfValues = 4;

    private buffers: Buffers;
    private shaderProgram: ShaderProgram;

    constructor() {
        new Time();
        this.buffers = new Buffers();
        this.shaderProgram = new ShaderProgram();

        this.initializeClearPresets();
        this.initializePresets();

        this.clear();
    }

    //
    // Initializes clearing values for gl renderer
    private initializeClearPresets():void
    {
        Engine3D.inst.GL.clearColor( 0, 0.85, 1.0, 1 );
        Engine3D.inst.GL.clearDepth(1.0); // 1.0 depth is farthest
    }

    private clear():void {
        /* clearing canvas */
        Engine3D.inst.GL.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT );
    }

    //
    // Initializes clearing values for gl renderer
    private initializePresets():void
    {
        Engine3D.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST); // tests for z value otherwise last drawn is put into buffer
        this.setUniform_Mat4x4(mat4.rotation_xz(0.125)); // model view set to the Identity
    }

    public render():void {
        document.dispatchEvent(Renderer.updateTimeEvent);
        window.requestAnimationFrame(this.render.bind(this));
        this.clear();
        this.buffers.bindVertexBuffer();
        this.RenderNext();
        this.buffers.unbindVertexBuffer();
    }

    public setUniform_Mat4x4(mat4: mat4):void {
        const loc = this.shaderProgram.vertexShader.source_fields['modelView']!.location();
        Engine3D.inst.GL.uniformMatrix4fv( loc, true, mat4.getData());
    }

    //
    // vec3 normalized device coordinates, vec4 color
    //
    public RenderOnce(vert_s:number[]):void
    {
        if(vert_s.length % Renderer.interleavedLength !== 0)
        {
            throw new DOMException(`The Length Of the Vertexes are not interleaved by ${Renderer.interleavedLength} floats`);
        }

        /* clearing canvas */
        this.clear();
        const vertexCount:number = (vert_s.length / Renderer.interleavedLength);

        const cordLoc:number = this.shaderProgram.vertexShader.source_fields['coordinates']?.location() as number;
        const colorLoc:number = this.shaderProgram.vertexShader.source_fields['color']?.location() as number;

        Engine3D.inst.GL.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, new Float32Array(vert_s), WebGL2RenderingContext.STATIC_DRAW);
        Engine3D.inst.GL.vertexAttribPointer(cordLoc, 3, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength*Renderer.bytesOfValues, 0);
        Engine3D.inst.GL.enableVertexAttribArray(cordLoc);
        Engine3D.inst.GL.vertexAttribPointer(colorLoc, 4, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength*Renderer.bytesOfValues, Renderer.bytesOfValues * Renderer.ndcInterleavedLength);
        Engine3D.inst.GL.enableVertexAttribArray(colorLoc);
        Engine3D.inst.GL.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT );
        Engine3D.inst.GL.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, vertexCount);
    }

    private rot_amt_xy:number = 0.0;
    private rot_amt_xz:number = 0.0;
    private rot_amt_yz:number = 0.0;
    private readonly rot_speed_xy:number = 0.25;
    private readonly rot_speed_xz:number = 0.5;
    private readonly rot_speed_yz:number = 0.05;
    public RenderNext() {

        const vert_s:number[] = [
            //bottom-left
            0,  0.5, 0,   0, 1, 0, 1.0, //left-t
            0.5, -0.5, 0,   0, 0, 1, 1.0, //right-t
            -0.5, -0.5, 0,   1, 0, 0, 1.0, //left-b
        ];

        this.rot_amt_xy += this.rot_speed_xy * Time.deltaTime;
        this.rot_amt_xz += this.rot_speed_xz * Time.deltaTime;
        this.rot_amt_yz += this.rot_speed_yz * Time.deltaTime;

        const mat:mat4 = mat4.rotation_yz(this.rot_amt_yz).multiply(mat4.rotation_xz(this.rot_amt_xz)).multiply(mat4.rotation_xy(this.rot_amt_xy));

        this.setUniform_Mat4x4(mat);

        this.RenderOnce(vert_s);
    }
}

export default Renderer;