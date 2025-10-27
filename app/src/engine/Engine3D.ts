import  Renderer from "./rendering/Renderer";
import Viewport from "./rendering/Viewport";
import Keyboard from "./InputDevices/Keyboard";
import Time from "./Time";
import Editor from "./Editor";

class Engine3D {
    private static instance:Engine3D;

    private gl: WebGL2RenderingContext;
    private renderer: Renderer;
    private viewport: Viewport;
    private editor: Editor;

    constructor(canvas: HTMLCanvasElement) {
        if(Engine3D.instance !== null && Engine3D.instance !== undefined) {
            throw new Error("Cannot Have Two instances of Engine3D");
        } else {
            Engine3D.instance = this;
        }
        new Time();
        new Keyboard();

        this.gl = (canvas.getContext('webgl2') as WebGL2RenderingContext);
        this.viewport = new Viewport(canvas, 800, 450);

        Renderer.Instantiate().then((renderer:Renderer) => {
            this.renderer = renderer;
            this.editor = new Editor();
            setInterval(this.fixedUpdate.bind(this), Time.MILI_SEC_PER_TICK);
            this.renderer.render();
        })
    }

    private fixedUpdate():void {
        Editor.fixedUpdate();
        /*
        for (const sceneObject of this.scene.objects) {
            sceneObject.fixedUpdate();
        }
        */
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

    public get RENDERER(): Renderer {
        return this.renderer;
    }
}

export default Engine3D;