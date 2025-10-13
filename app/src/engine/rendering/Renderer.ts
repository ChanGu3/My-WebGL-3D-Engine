import Engine3D from "../Engine3D";
import ShaderProgram, {VertexShaderFieldAttributes} from "./shaders/ShaderProgram";
import Time from "../Time";
import Mesh from "./Mesh";
import shaderProgram from "./shaders/ShaderProgram";
import mesh from "./Mesh";

//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    private static updateTimeEvent:Event = new Event("updateTimeEvent");

    private meshes: Mesh[];
    private shaderProgram: ShaderProgram;

    constructor() {
        new Time();

        this.shaderProgram = new ShaderProgram(VertexShaderFieldAttributes.COORDINATES);
        this.shaderProgram.CompileAttachAndLink().then(
            () => {
                this.meshes = [];
                //Mesh.from_obj_file("cow.obj", this.shaderProgram, this.AddToMeshes.bind(this));
                const mesh1:Mesh = Mesh.box(this.shaderProgram, 1, 1, 1);
                this.meshes.push(mesh1);

                this.initializeClearPresets();
                this.initializePresets();

                this.clear();
                this.render();
            }
        );
    }

    public AddToMeshes(mesh:Mesh) {
        this.meshes.push(mesh);
        //this.meshes.push(Mesh.box(this.shaderProgram, 0.25, 0.25, 0.25));
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

    public render():void {
        document.dispatchEvent(Renderer.updateTimeEvent);
        const aniFrameID:number = window.requestAnimationFrame(this.render.bind(this));
        this.clear();
        try {
            for (const mesh of this.meshes) {
                mesh.render();
            }
        } catch (e) {
            console.error(e);
            window.cancelAnimationFrame(aniFrameID);
        }
    }
}

export default Renderer;