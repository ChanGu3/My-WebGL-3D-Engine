import Buffers from "./Buffers.js";
import  Renderer from "./Rendering/Renderer.js";

class Engine3D {
    private static instance:Engine3D;

    private gl: WebGL2RenderingContext;

    private renderer: Renderer;

    constructor(gl: WebGL2RenderingContext) {
        if(Engine3D.instance !== null && Engine3D.instance !== undefined) {
            throw new Error("Cannot Have Two instances of Engine3D");
        }
        Engine3D.instance = this;
        this.gl = gl;
        this.renderer = new Renderer();
        this.renderer.render();
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
}

export default Engine3D;