import Buffers from "./Buffers.js";
import  Renderer from "./Rendering/Renderer.js";

class Engine3D {
    private static instance:Engine3D;

    private gl: WebGL2RenderingContext;

    private buffers: Buffers;
    private renderer: Renderer;

    constructor(gl: WebGL2RenderingContext) {
        if(Engine3D.instance !== null && Engine3D.instance !== undefined) {
            throw new Error("Cannot Have Two instances of Engine3D");
        }
        Engine3D.instance = this;
        this.gl = gl;
        this.buffers = new Buffers();
        this.renderer = new Renderer();
    }

    //
    // Gets the instance of the current running engine
    //
    public static get inst(): Engine3D {
        if (Engine3D.instance == null) {
            throw new Error("Must Create a Instance Of Engine3D Before Using It");
        }
        return Engine3D.instance;
    }

    //
    // Gets the Rendering Context Of The Engine
    //
    public get GL(): WebGL2RenderingContext {
        return this.gl;
    }


    //
    // vec3 normalized device coordinates, vec4 color
    //
    public DrawOnce(vert_s:number[]):void
    {
        this.buffers.bindVertexBuffer();
        this.renderer.DrawOnce(vert_s);
        this.buffers.unbindVertexBuffer();
    }
}

export default Engine3D;