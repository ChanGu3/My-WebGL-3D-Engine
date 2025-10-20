import  Renderer from "./rendering/Renderer";
import Viewport from "./rendering/Viewport";
import Keyboard from "./InputDevices/Keyboard";
import Key from "./InputDevices/Key";
import Scene from "./Scene";
import SceneObject from "./SceneObject";
import Time from "./Time";

class Engine3D {
    private static instance:Engine3D;

    private gl: WebGL2RenderingContext;
    private renderer: Renderer;
    private viewport: Viewport;
    private scene: Scene;

    constructor(canvas: HTMLCanvasElement) {
        if(Engine3D.instance !== null && Engine3D.instance !== undefined) {
            throw new Error("Cannot Have Two instances of Engine3D");
        }
        Engine3D.instance = this;
        new Time();
        new Keyboard();

        this.gl = (canvas.getContext('webgl2') as WebGL2RenderingContext);
        this.viewport = new Viewport(canvas, 800, 450);

        this.renderer = new Renderer();
        this.renderer.LoadMeshes().then(() => {
            this.scene = new Scene();
        })

        setInterval(this.fixedUpdate.bind(this), Time.MILI_SEC_PER_TICK);
    }

    private fixedUpdate():void {
        this.scene.fixedUpdate();
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

    public get SCENE(): Scene {
        return this.scene;
    }

    public get RENDERER(): Renderer {
        return this.renderer;
    }
}

export default Engine3D;