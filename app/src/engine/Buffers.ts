class Buffers {

    private vertex_buffer:WebGLBuffer;

    constructor(gl: WebGL2RenderingContext) {
        this.vertex_buffer = gl.createBuffer();
    }

    public bindVertexBuffer(gl: WebGL2RenderingContext)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    }

    public unbindVertexBuffer(gl: WebGL2RenderingContext)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

}

export default Buffers;