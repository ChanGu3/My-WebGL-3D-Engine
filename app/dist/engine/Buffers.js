import Engine3D from "./Engine3D.js";
class Buffers {
    constructor() {
        this.vertex_buffer = Engine3D.inst.GL.createBuffer();
    }
    bindVertexBuffer() {
        Engine3D.inst.GL.bindBuffer(Engine3D.inst.GL.ARRAY_BUFFER, this.vertex_buffer);
    }
    unbindVertexBuffer() {
        Engine3D.inst.GL.bindBuffer(Engine3D.inst.GL.ARRAY_BUFFER, null);
    }
}
export default Buffers;
//# sourceMappingURL=Buffers.js.map