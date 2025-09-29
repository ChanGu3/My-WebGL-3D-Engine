import Engine3D from "../Engine3D.js";
import ShaderProgram from "./Shaders/ShaderProgram.js";
import mat4, { UniqueMatrix } from "../LinearAlgebra/Mat4.js";
import Buffers from "../Buffers.js";
import Time from "../Time.js";
//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    constructor() {
        this.rot_amt_xy = 0.0;
        this.rot_amt_xz = 0.0;
        this.rot_amt_yz = 0.0;
        this.rot_speed_xy = 0.25;
        this.rot_speed_xz = 0.5;
        this.rot_speed_yz = 0.05;
        new Time();
        this.buffers = new Buffers();
        this.shaderProgram = new ShaderProgram();
        this.initializeClearPresets();
        this.initializePresets();
        this.clear();
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
        this.setUniform_Mat4x4(mat4.rotation_xz(0.125)); // model view set to the Identity
    }
    render() {
        document.dispatchEvent(Renderer.updateTimeEvent);
        window.requestAnimationFrame(this.render.bind(this));
        this.clear();
        this.buffers.bindVertexBuffer();
        this.RenderNext();
        this.buffers.unbindVertexBuffer();
    }
    setUniform_Mat4x4(mat4) {
        const loc = this.shaderProgram.vertexShader.source_fields['modelView'].location();
        Engine3D.inst.GL.uniformMatrix4fv(loc, true, mat4.getData());
    }
    //
    // vec3 normalized device coordinates, vec4 color
    //
    RenderOnce(vert_s) {
        var _a, _b;
        if (vert_s.length % Renderer.interleavedLength !== 0) {
            throw new DOMException(`The Length Of the Vertexes are not interleaved by ${Renderer.interleavedLength} floats`);
        }
        /* clearing canvas */
        this.clear();
        const vertexCount = (vert_s.length / Renderer.interleavedLength);
        const cordLoc = (_a = this.shaderProgram.vertexShader.source_fields['coordinates']) === null || _a === void 0 ? void 0 : _a.location();
        const colorLoc = (_b = this.shaderProgram.vertexShader.source_fields['color']) === null || _b === void 0 ? void 0 : _b.location();
        Engine3D.inst.GL.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, new Float32Array(vert_s), WebGL2RenderingContext.STATIC_DRAW);
        Engine3D.inst.GL.vertexAttribPointer(cordLoc, 3, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength * Renderer.bytesOfValues, 0);
        Engine3D.inst.GL.enableVertexAttribArray(cordLoc);
        Engine3D.inst.GL.vertexAttribPointer(colorLoc, 4, WebGL2RenderingContext.FLOAT, false, Renderer.interleavedLength * Renderer.bytesOfValues, Renderer.bytesOfValues * Renderer.ndcInterleavedLength);
        Engine3D.inst.GL.enableVertexAttribArray(colorLoc);
        Engine3D.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        Engine3D.inst.GL.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, vertexCount);
    }
    RenderNext() {
        const vert_s = [
            //bottom-left
            0, 0.5, 0, 0, 1, 0, 1.0, //left-t
            0.5, -0.5, 0, 0, 0, 1, 1.0, //right-t
            -0.5, -0.5, 0, 1, 0, 0, 1.0, //left-b
        ];
        this.rot_amt_xy += this.rot_speed_xy * Time.deltaTime;
        this.rot_amt_xz += this.rot_speed_xz * Time.deltaTime;
        this.rot_amt_yz += this.rot_speed_yz * Time.deltaTime;
        const mat = mat4.rotation_yz(this.rot_amt_yz).multiply(mat4.rotation_xz(this.rot_amt_xz)).multiply(mat4.rotation_xy(this.rot_amt_xy));
        this.setUniform_Mat4x4(mat);
        this.RenderOnce(vert_s);
    }
}
Renderer.updateTimeEvent = new Event("updateTimeEvent");
Renderer.ndcInterleavedLength = 3;
Renderer.colorInterleavedLength = 4;
Renderer.interleavedLength = Renderer.ndcInterleavedLength + Renderer.colorInterleavedLength;
Renderer.bytesOfValues = 4;
export default Renderer;
//# sourceMappingURL=Renderer.js.map