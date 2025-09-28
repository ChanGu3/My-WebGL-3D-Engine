import Engine3D from "../Engine3D.js";
import ShaderProgram from "./Shaders/ShaderProgram.js";

//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    private static readonly ndcInterleavedLength = 3;
    private static readonly colorInterleavedLength = 4;
    private static readonly interleavedLength = Renderer.ndcInterleavedLength + Renderer.colorInterleavedLength;
    private static readonly bytesOfValues = 4;

    private shaderProgram: ShaderProgram;

    constructor() {
        this.initializeClearPresets();
        this.initializePresets();

        this.clear();
        this.shaderProgram = new ShaderProgram();
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
    }


    public render() {
        window.requestAnimationFrame(this.render);

    }

    //
    // vec3 normalized device coordinates, vec4 color
    //
    public DrawOnce(vert_s:number[]):void
    {
        if(vert_s.length % Renderer.interleavedLength !== 0)
        {
            throw new DOMException(`The Length Of the Vertexes are not interleaved by ${Renderer.interleavedLength} floats`);
        }

        /* clearing canvas */
        this.clear();
        const vertexCount:number = (vert_s.length / Renderer.interleavedLength);

        const cordLoc:number = this.shaderProgram.vertexShader.source_atr['coordinates']?.location() as number;
        const colorLoc:number = this.shaderProgram.vertexShader.source_atr['color']?.location() as number;


        Engine3D.inst.GL.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, new Float32Array(vert_s), WebGL2RenderingContext.STATIC_DRAW);
        Engine3D.inst.GL.vertexAttribPointer(cordLoc, 3, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength*Renderer.bytesOfValues, 0);
        Engine3D.inst.GL.enableVertexAttribArray(cordLoc);
        Engine3D.inst.GL.vertexAttribPointer(colorLoc, 4, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength*Renderer.bytesOfValues, Renderer.bytesOfValues * Renderer.ndcInterleavedLength);
        Engine3D.inst.GL.enableVertexAttribArray(colorLoc);
        Engine3D.inst.GL.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT );
        Engine3D.inst.GL.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, vertexCount);
    }
}

export default Renderer;