import Engine3D from "../Engine3D";
import ShaderProgram, {VertexShaderFieldAttributes} from "./shaders/ShaderProgram";
import Time from "../Time";
import Mesh from "./Mesh";
import shaderProgram from "./shaders/ShaderProgram";
import mesh from "./Mesh";
import SceneObject from "../SceneObject";

type MESHES = {
    [name:string]: Mesh;
};

//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    private static updateTimeEvent:Event = new Event("updateTimeEvent");

    private meshes: MESHES = {};
    private shaderProgram: ShaderProgram;

    constructor() {
        this.shaderProgram = new ShaderProgram(VertexShaderFieldAttributes.COORDINATES);
        this.shaderProgram.CompileAttachAndLink().then(
            () => {

                this.initializeClearPresets();
                this.initializePresets();

                this.clear();
                this.render();
            }
        );

    }

    // @ts-ignore
    public async LoadMeshes(): Promise<void> {
        this.AddToMeshes( await Mesh.get_obj_from_file("teapot.obj", this.shaderProgram));
        this.meshes['cube'] = Mesh.box(this.shaderProgram, 1, 1, 1);
    }

    //
    // Initializes clearing values for gl renderer
    private initializeClearPresets():void
    {
        Engine3D.inst.GL.clearColor( 0, 0.85, 1.0, 1 );
        Engine3D.inst.GL.clearDepth(1.0); // 1.0 depth is farthest
    }

    private clear():void {
        /* clearing canvas */
        Engine3D.inst.GL.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT );
    }

    //
    // Initializes clearing values for gl renderer
    private initializePresets():void
    {
        Engine3D.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST); // tests for z value otherwise last drawn is put into buffer
    }

    public get Meshes(): MESHES {
        return this.meshes;
    }

    public AddToMeshes(mesh:Mesh) {
        this.meshes['loaded'] = mesh;
    }

    public render():void {
        document.dispatchEvent(Renderer.updateTimeEvent);
        const aniFrameID:number = window.requestAnimationFrame(this.render.bind(this));
        //Engine3D.inst.VIEWPORT.SetResolution(700 * Math.sin(Time.timeElapsed / 1000 * 0.5) ** 2 + 200, 400 * Math.cos(Time.timeElapsed / 1000 * 0.5) ** 2 + 200);
        this.clear();
        try {
            for (const sceneObject of Engine3D.inst.SCENE.objects) {
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