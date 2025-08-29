import Buffers from "./Buffers.js";
import ShaderProgram from "./Shaders/ShaderProgram.js";
class Engine3D {
    //
    // Sets preset values for gl
    //
    initializePresets() {
        this.gl.clearColor(0, 0.85, 1.0, 1);
        this.gl.clearDepth(1.0); // 1.0 depth is farthest
    }
    constructor(gl) {
        this.gl = gl;
        this.initializePresets();
        this.buffers = new Buffers(this.gl);
        this.gl.enable(WebGL2RenderingContext.DEPTH_TEST); // tests for z value otherwise last drawn is put into buffer
        this.shaderProgram = new ShaderProgram(this.gl);
        this.shaderProgram.linkProgram(this.gl);
        this.shaderProgram.useProgram(this.gl);
    }
    //
    // vec3 normalized device coordinates, vec4 color
    //
    DrawOnceByInterleavedAttributes(vert_s) {
        var _a, _b;
        const interleavedLength = 7;
        const byteSize = 4; // using Float32Array
        const ndcSize = 3;
        const colorSize = 4;
        if (vert_s.length % interleavedLength !== 0) {
            throw new DOMException("The Length Of the Vertexs and the ");
        }
        const vertexCount = (vert_s.length / interleavedLength);
        const atrLoc_coordinates = (_a = this.shaderProgram.vertexShader.source_atr['coordinates']) === null || _a === void 0 ? void 0 : _a.location();
        const atrLoc_color = (_b = this.shaderProgram.vertexShader.source_atr['color']) === null || _b === void 0 ? void 0 : _b.location();
        /* clearing canvas */
        this.gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        this.buffers.bindVertexBuffer(this.gl);
        this.gl.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, new Float32Array(vert_s), WebGL2RenderingContext.STATIC_DRAW);
        this.gl.vertexAttribPointer(atrLoc_coordinates, 3, WebGL2RenderingContext.FLOAT, false, interleavedLength * byteSize, 0);
        this.gl.vertexAttribPointer(atrLoc_color, 4, WebGL2RenderingContext.FLOAT, false, interleavedLength * byteSize, byteSize * ndcSize);
        this.gl.enableVertexAttribArray(atrLoc_coordinates);
        this.gl.enableVertexAttribArray(atrLoc_color);
        this.gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        this.gl.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, vertexCount);
        this.buffers.unbindVertexBuffer(this.gl);
    }
}
export default Engine3D;
//# sourceMappingURL=Engine3D.js.map