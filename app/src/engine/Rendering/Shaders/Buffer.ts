import Engine3D from "../../Engine3D";

class Buffer {
    /*
    *  returns buffer loaded with data using usagePattern
    */
    public static createAndLoadVertexBuffer(data:number[], usage:number):WebGLBuffer {
        const bindingPoint:number = Engine3D.inst.GL.ARRAY_BUFFER;
        const bindingPointCurrent:number = Engine3D.inst.GL.ARRAY_BUFFER_BINDING;
        return this.createAndLoadBuffer(new Float32Array(data), bindingPoint, bindingPointCurrent, usage);
    }

    /*
    *  returns buffer loaded with data using usagePattern
    */
    public static createAndLoadElementsBuffer(data:number[], usage:number):WebGLBuffer {
        const bindingPoint:number = Engine3D.inst.GL.ELEMENT_ARRAY_BUFFER;
        const bindingPointCurrent:number = Engine3D.inst.GL.ELEMENT_ARRAY_BUFFER_BINDING;
        return this.createAndLoadBuffer(new Uint16Array(data), bindingPoint, bindingPointCurrent, usage);
    }

    /*
    *   return id of buffer created and loaded with data at bindingPoint and using usage
    */
    private static createAndLoadBuffer(srcData:ArrayBuffer, bindingPoint:number, bindingPointCurrent:number, usage:number):WebGLBuffer {
        const current_array_buf = Engine3D.inst.GL.getParameter( bindingPointCurrent );

        const buf_id = Engine3D.inst.GL.createBuffer();
        Engine3D.inst.GL.bindBuffer( bindingPoint, buf_id );
        Engine3D.inst.GL.bufferData( bindingPoint, srcData, usage );

        Engine3D.inst.GL.bindBuffer( bindingPoint, current_array_buf );

        return buf_id;
    }

    /*
    *  binds the buffer_id to the binding point and returns the buffer bound to the bindingPointCurrent
    */
    private static bindBuffer(buffer_id:WebGLBuffer, bindingPoint:number, bindingPointCurrent:number):WebGLBuffer|null {
        const current_array_buf:WebGLBuffer|null = Engine3D.inst.GL.getParameter( bindingPointCurrent );
        Engine3D.inst.GL.bindBuffer(bindingPoint, buffer_id);
        return current_array_buf;
    }

    /*
     *  binds the buffer_id to the ARRAY_BUFFER and returns the current bound buffer
    */
    public static bindArrayBuffer(buffer_id:WebGLBuffer):WebGLBuffer|null {
        return this.bindBuffer(buffer_id, WebGL2RenderingContext.ARRAY_BUFFER, WebGL2RenderingContext.ARRAY_BUFFER_BINDING);
    }

    /*
    *  binds the buffer_id to the ELEMENT_ARRAY_BUFFER and returns the current bound buffer
    */
    public static bindElementArrayBuffer(buffer_id:WebGLBuffer):WebGLBuffer|null {
        return this.bindBuffer(buffer_id, WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER_BINDING);
    }

    /*
    *  unbinds the chosen bindingPoint
    */
    public static unbind(bindingPoint:number):void
    {
        Engine3D.inst.GL.bindBuffer(bindingPoint, null);
    }

}

export default Buffer;