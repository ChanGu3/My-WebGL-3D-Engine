import Engine3D from "../Engine3D";
import ShaderProgram from "./shaders/ShaderProgram";
import Mesh from "./Mesh";
import Editor from "../Editor";
import Texture from "../Texture";



//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    private static instance: Renderer;

    private static updateTimeEvent:Event = new Event("updateTimeEvent");

    // @ts-ignore
    public static async Instantiate(): Promise<Renderer> {
        if(Renderer.instance != null) {
            throw new Error("Can Only Create One Renderer");
        }
        Renderer.instance = new Renderer();

        Renderer.instance.initializeClearPresets();
        Renderer.instance.initializePresets();
        Renderer.instance.clear();

        await ShaderProgram.LoadShaderPrograms();
        await Mesh.LoadMeshes();
        await Texture.LoadTextures();

        return Renderer.instance;
    }

    /*
     * initializes clearing state
    */
    private initializeClearPresets():void {
        Engine3D.inst.GL.clearColor( 0, 0.85, 1.0, 1 );
        Engine3D.inst.GL.clearDepth(1.0); // 1.0 depth is farthest
    }

    /*
     * clears the screen
    */
    private clear():void {
        /* clearing canvas */
        Engine3D.inst.GL.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT );
    }

    //
    // Initializes clearing values for gl renderer
    private initializePresets():void {
        Engine3D.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST); // tests for z value otherwise last drawn is put into
    }

    /*
    *  renders all the vertices in the scene
    */
    public render():void {
        document.dispatchEvent(Renderer.updateTimeEvent);
        const aniFrameID:number = window.requestAnimationFrame(this.render.bind(this));
        //Engine3D.inst.VIEWPORT.SetResolution(700 * Math.sin(Time.timeElapsed / 1000 * 0.5) ** 2 + 200, 400 * Math.cos(Time.timeElapsed / 1000 * 0.5) ** 2 + 200);
        this.clear();
        try {
            for (const sceneObject of Editor.Scene.objects) {
                //sceneObject.update();
                sceneObject.render();
            }
        } catch (e) {
            console.error(e);
            window.cancelAnimationFrame(aniFrameID);
        }
    }
}

export default Renderer;