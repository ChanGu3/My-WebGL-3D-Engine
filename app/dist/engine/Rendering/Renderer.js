import Engine3D from "../Engine3D.js";
import ShaderProgram from "./Shaders/ShaderProgram.js";
//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    constructor() {
        this.initializeClearPresets();
        this.initializePresets();
        this.clear();
        this.shaderProgram = new ShaderProgram();
    }
    //
    // Initializes clearing values for gl renderer
    initializeClearPresets() {
        Engine3D.inst.GL.clearColor(0, 0.85, 1.0, 1);
        Engine3D.inst.GL.clearDepth(1.0); // 1.0 depth is farthest
    }
    clear() {
        /* clearing canvas */
        Engine3D.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
    }
    //
    // Initializes clearing values for gl renderer
    initializePresets() {
        Engine3D.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST); // tests for z value otherwise last drawn is put into buffer
    }
    render() {
        window.requestAnimationFrame(this.render);
    }
    //
    // vec3 normalized device coordinates, vec4 color
    //
    DrawOnce(vert_s) {
        var _a, _b;
        if (vert_s.length % Renderer.interleavedLength !== 0) {
            throw new DOMException(`The Length Of the Vertexes are not interleaved by ${Renderer.interleavedLength} floats`);
        }
        /* clearing canvas */
        this.clear();
        const vertexCount = (vert_s.length / Renderer.interleavedLength);
        const cordLoc = (_a = this.shaderProgram.vertexShader.source_atr['coordinates']) === null || _a === void 0 ? void 0 : _a.location();
        const colorLoc = (_b = this.shaderProgram.vertexShader.source_atr['color']) === null || _b === void 0 ? void 0 : _b.location();
        Engine3D.inst.GL.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, new Float32Array(vert_s), WebGL2RenderingContext.STATIC_DRAW);
        Engine3D.inst.GL.vertexAttribPointer(cordLoc, 3, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength * Renderer.bytesOfValues, 0);
        Engine3D.inst.GL.enableVertexAttribArray(cordLoc);
        Engine3D.inst.GL.vertexAttribPointer(colorLoc, 4, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength * Renderer.bytesOfValues, Renderer.bytesOfValues * Renderer.ndcInterleavedLength);
        Engine3D.inst.GL.enableVertexAttribArray(colorLoc);
        Engine3D.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        Engine3D.inst.GL.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, vertexCount);
    }
}
Renderer.ndcInterleavedLength = 3;
Renderer.colorInterleavedLength = 4;
Renderer.interleavedLength = Renderer.ndcInterleavedLength + Renderer.colorInterleavedLength;
Renderer.bytesOfValues = 4;
export default Renderer;
//# sourceMappingURL=Renderer.js.map