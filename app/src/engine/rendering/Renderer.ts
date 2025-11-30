import Engine3D from "../Engine3D";
import Debug from "../Debug"
import Render3D from "./jobs/Render3D";
import Light3D from "./jobs/Lights/Light3D";
import DirectionalLight3D from "./jobs/Lights/DirectionalLight3D";
import PointLight3D from "./jobs/Lights/PointLight3D";
import ShaderProgram from "./shaders/ShaderProgram";
import SceneGraph from "../Scene/SceneGraph";
import Camera from "../Scene/Components/Cameras/Camera";
import Editor from "../Editor";
import Mat4 from "../linear-algebra/Mat4";


//
// Render that expects Interleaved Vectors for rendering
//
class Renderer {
    public static inst: Renderer;

    public static StartNewFrameEvent:Event = new Event("StartNewFrameEvent");

    public static Camera: Camera = Editor.Camera;
    private static renderTransparent3DJobs: Render3D[] = [];
    public static render3DJobs: Render3D[] = [];
    public static light3DJobs: Light3D[] = [];

    public constructor() {
        if(Renderer.inst != null) { throw new Error(`cannot create more than one renderer per Engine3D ${Engine3D.NAME}`); return; }

        Renderer.inst = this;
        Renderer.initializeClearPresets();
        Renderer.initializePresets();
        Renderer.clear();
    }


    /*
     * initializes clearing state
    */
    private static initializeClearPresets():void {
        Engine3D.inst.GL.clearColor( 0.05, 0.08, 0.15, 1 );
        Engine3D.inst.GL.clearDepth(1.0); // 1.0 depth is farthest
    }

    /*
     * clears the screen
    */
    private static clear():void {
        /* clearing canvas */
        Engine3D.inst.GL.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT );
    }

    //
    // Initializes clearing values for gl renderer
    private static initializePresets():void {
        Engine3D.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST); // tests for z value otherwise last drawn is placed on top of screen
        Engine3D.inst.GL.enable(WebGL2RenderingContext.BLEND);
        Engine3D.inst.GL.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
    }

    /*
    *  renders everything for the scene
    */
    public static render():void {
        document.dispatchEvent(Renderer.StartNewFrameEvent);
        const aniFrameID:number = window.requestAnimationFrame(this.render.bind(this));
        Renderer.clear();
        try {
            Renderer.SetCamera();
            if(SceneGraph.Current) { SceneGraph.Current.generateJobs(); }
            Renderer.SetLighting();
            Renderer.Render3DSceneGraph();
        } catch (error:any) {
            Debug.LogError("Something went wrong while rendering", Renderer.name, error.message);
            window.cancelAnimationFrame(aniFrameID);
        } finally {
            Renderer.ClearJobs();
        }
    }

    private static GetDistanceToCamera(matrix: Mat4) {
        return Renderer.Camera.SceneObject.WorldPosition.sub(matrix.vectorBasisW().Vec3()).magnitude;
    }

    public static AddRenderJob(render3D: Render3D) {
        if(render3D.Material.HasTransparency) {
            Renderer.AddTransparentRenderJob(render3D);
        }
        else {
            Renderer.render3DJobs.push(render3D);
        }
    }

    private static AddTransparentRenderJob(render3D: Render3D) {       

        const renderMag = Renderer.GetDistanceToCamera(render3D.Matrix);  
        let startIndex = 0;
        let endIndex = Renderer.renderTransparent3DJobs.length;;

        while(startIndex < endIndex)
        { 
            const mid = (startIndex + endIndex) >>> 1;
            const listMag = Renderer.GetDistanceToCamera(Renderer.renderTransparent3DJobs[mid].Matrix); 

            if(renderMag === listMag) { Renderer.renderTransparent3DJobs.splice(mid+1, 0, render3D); return; }

            if(renderMag < listMag) {
                startIndex = mid + 1;
            }
            else {
                endIndex = mid; 
            }
        }

        Renderer.renderTransparent3DJobs.splice(startIndex, 0, render3D); return;
    }

    private static ClearJobs(){
        this.light3DJobs = []
        this.render3DJobs = []
        this.renderTransparent3DJobs = []
    }

    private static Render3DSceneGraph() {
        for (const render3D of Renderer.render3DJobs) {
            render3D.render();
        }

        for (const render3D of Renderer.renderTransparent3DJobs) {
            render3D.render();
        }
    }

    private static directionalLightsCount: number = 0;
    private static directional_light_dir_list:number[] = [];
    private static directional_light_color_list:number[] = [];

    private static pointLightsCount:number = 0;
    private static point_light_pos_list:number[] = [];
    private static point_light_color_list:number[] = [];
    private static point_light_coefficient_list:number[] = [];

    private static loggedCamera = false;
    private static SetCamera() {
        if(!Editor.IsEditorCamera) 
        { 
            if(SceneGraph.Current && SceneGraph.Current.Camera) 
            {
                Renderer.loggedCamera = false;
                Renderer.Camera = SceneGraph.Current.Camera; 
            } 
            else if (!Renderer.loggedCamera)
            {
                Renderer.loggedCamera = true;
                Debug.LogWarning("Attempted switching to scene graph camera but it does not exist", "Renderer", "possibly the camera in the scene graph is null")
            }
            return; 
        }
        Renderer.Camera = Editor.Camera;
    }

    // Lights are hardcoded to use the default program.
    private static SetLighting() {
        Renderer.directionalLightsCount = 0;
        Renderer.directional_light_dir_list = [];
        Renderer.directional_light_color_list = [];

        Renderer.pointLightsCount = 0;
        Renderer.point_light_pos_list = [];
        Renderer.point_light_color_list = [];
        Renderer.point_light_coefficient_list = [];

        this.light3DJobs.forEach((light) => {
            if(light instanceof DirectionalLight3D){
                Renderer.directional_light_dir_list.push(light.Direction.X, light.Direction.Y, light.Direction.Z);
                Renderer.directional_light_color_list.push(light.Color.X, light.Color.Y, light.Color.Z);
                Renderer.directionalLightsCount++;
            } 
            else if(light instanceof PointLight3D) {
                Renderer.point_light_pos_list.push(light.Position.X, light.Position.Y, light.Position.Z);
                Renderer.point_light_color_list.push(light.Color.X, light.Color.Y, light.Color.Z);
                Renderer.point_light_coefficient_list.push(light.LightCoefficient);
                Renderer.pointLightsCount++;
            }
        });

        if(16 < Renderer.directionalLightsCount) { throw new Error("can only have 16 directional lights in one scene"); }

        if(16 < Renderer.pointLightsCount) { throw new Error("can only have 16 point lights in one scene"); }

        if((Renderer.pointLightsCount + Renderer.directionalLightsCount) > 16) { Debug.LogWarning("Having too many lights can slow performance", "Renderer", "More than 16 lights in scene"); } 
    }

    public static ApplyLightingToRender() {
        if(0 < Renderer.directionalLightsCount) {
            ShaderProgram.ShaderPrograms['default'].setDirectionalLights(Renderer.directional_light_dir_list, Renderer.directional_light_color_list, Renderer.directionalLightsCount);
        }

        if(0 < Renderer.pointLightsCount) {
            ShaderProgram.ShaderPrograms['default'].setPointLights(Renderer.point_light_pos_list, Renderer.point_light_color_list, Renderer.point_light_coefficient_list, Renderer.pointLightsCount);
        }
    }
}

export default Renderer;