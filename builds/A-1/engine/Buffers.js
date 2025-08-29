class Buffers {
    constructor(gl) {
        this.vertex_buffer = gl.createBuffer();
    }
    bindVertexBuffer(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    }
    unbindVertexBuffer(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
export default Buffers;
//# sourceMappingURL=Buffers.js.map