import  Renderer from "./rendering/Renderer";
import Viewport from "./rendering/Viewport";
import viewport from "./rendering/Viewport";

class Engine3D {
    private static instance:Engine3D;

    private gl: WebGL2RenderingContext;
    private renderer: Renderer;
    private viewport: Viewport;

    constructor(canvas: HTMLCanvasElement) {
        if(Engine3D.instance !== null && Engine3D.instance !== undefined) {
            throw new Error("Cannot Have Two instances of Engine3D");
        }
        Engine3D.instance = this;
        this.gl = (canvas.getContext('webgl2') as WebGL2RenderingContext);

        this.viewport = new Viewport(canvas, 1280, 720);

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
    // Gets the rendering Context Of The Engine
    //
    public get GL(): WebGL2RenderingContext {
        return this.gl;
    }

    public get VIEWPORT(): Viewport {
        return this.viewport;
    }
}

export default Engine3D;