import Renderer from "./rendering/Renderer";
import Viewport from "./Viewport";
import ShaderProgram from "./rendering/shaders/ShaderProgram";
import Mesh from "./rendering/Mesh";
import Texture from "./rendering/Texture";
import Editor from "./Editor";
import TestScene from "../mydata/TestScene";
import LightGameScene from "../mydata/LightGameScene";

class Engine3D {

    public static readonly NAME = "CVE Engine";

    private static instance:Engine3D;

    private gl: WebGL2RenderingContext;
    private viewport?: Viewport = undefined;
    private renderer?: Renderer = undefined;

    public static async run(canvasID:string = 'canvas'): Promise<void> {
        if(Engine3D.instance != null && Engine3D.instance !== undefined) { throw new Error(`Cannot run two instances of the 3DEngine ${Engine3D.NAME}`); }

        const canvas: HTMLCanvasElement = (document.getElementById(canvasID) as HTMLCanvasElement);
        Engine3D.instance = new Engine3D(canvas);
        Engine3D.instance.renderer = new Renderer();
        Engine3D.instance.viewport = new Viewport(canvas, 854, 480);
        
        await ShaderProgram.LoadShaderPrograms();
        await Mesh.LoadMeshes();
        await Texture.LoadTextures();

        Editor.LoadSceneGraph(LightGameScene);
        Renderer.render();
    } 

    constructor(canvas: HTMLCanvasElement) {
        this.gl = (canvas.getContext('webgl2') as WebGL2RenderingContext);
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
        return this.viewport as Viewport;
    }

        public get RENDERER(): Renderer {
        return this.viewport as Renderer;
    }
}

export default Engine3D;