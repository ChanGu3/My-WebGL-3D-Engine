import Engine3D from "../../Engine3D.js";

class Buffers {

    private vertex_buffer:WebGLBuffer;

    constructor() {
        this.vertex_buffer = Engine3D.inst.GL.createBuffer();
    }

    public bindVertexBuffer()
    {
        Engine3D.inst.GL.bindBuffer(Engine3D.inst.GL.ARRAY_BUFFER, this.vertex_buffer);
    }

    public unbindVertexBuffer()
    {
        Engine3D.inst.GL.bindBuffer(Engine3D.inst.GL.ARRAY_BUFFER, null);
    }

}

export default Buffers;