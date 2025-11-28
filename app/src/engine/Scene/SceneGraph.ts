import Mat4 from "../linear-algebra/Mat4";
import DirectionalLight3D from "../rendering/jobs/Lights/DirectionalLight3D";
import PointLight3D from "../rendering/jobs/Lights/PointLight3D";
import Renderer from "../rendering/Renderer";
import Camera from "./Components/Cameras/Camera";
import DirectionalLight from "./Components/Lights/DirectionalLight";
import PointLight from "./Components/Lights/PointLight";
import Renderer3D from "./Components/Renderer3D";
import SceneObject from "./SceneObject";

abstract class SceneGraph {
    public static Current: SceneGraph|null = null; 

    private camera: Camera|null = null;
    protected root: SceneObject = new SceneObject("root");

    public UpdateEvent: Event = new Event("SceneGraphUpdate" )
    public FixedUpdateEvent: Event = new Event("SceneGraphFixedUpdate");

    constructor() {
        if( SceneGraph.Current != null ) { SceneGraph.Current.RemoveAllEvents(); }

        SceneGraph.Current = this;
        SceneObject.set_ROOT_SCENE_OBJECT(this.root);
        //SceneGraph.Current.AddAllEvents();
    }

    public get Camera(): Camera|null {
        return this.camera;
    }

    public set Camera(camera: Camera) {
        this.camera = camera;
    }

    // TODO I CAN MAKE THIS DIFFERENT LATER ON FOR NOW CREATING A NEW SCENE MAKES IT CURRENT
    public SetAsCurrent() {}

    public Update() {
        document.dispatchEvent(this.UpdateEvent);
    }

    public FixedUpdate() {
        document.dispatchEvent(this.FixedUpdateEvent);
    }

    public generateJobs(currentSceneObject: SceneObject = this.root, parentMat4: Mat4 = Mat4.identity()) {

        const relativeMat4 = parentMat4.multiply(currentSceneObject.Transform.modelMatrix());
        const renderer3D = currentSceneObject.getComponent(Renderer3D);
        if(renderer3D) { renderer3D.add_render_job(relativeMat4); }
        
        const directionLight = currentSceneObject.getComponent(DirectionalLight); 
        if (directionLight) { Renderer.light3DJobs.push(new DirectionalLight3D(directionLight.Color, directionLight.Transform.rotation)) }
        const pointLight = currentSceneObject.getComponent(PointLight);
        if (pointLight) { Renderer.light3DJobs.push(new PointLight3D(pointLight.Color, pointLight.SceneObject.WorldPosition, pointLight.Light_Coefficient)) }

        currentSceneObject.Children.forEach((child) => {
            this.generateJobs(child, relativeMat4);
        })
        return;
    }

    public AddAllEvents(currentSceneObject: SceneObject = this.root) {
        currentSceneObject.Components.forEach((component) => {
            component.addExistingOverridesToEvents();
        })

        currentSceneObject.Children.forEach((child) => {
            this.AddAllEvents(child);
        })
    }

    public RemoveAllEvents(currentSceneObject: SceneObject = this.root) {
        currentSceneObject.Components.forEach((component) => {
            component.removeExistingOverridesFromEvents();
        })

        currentSceneObject.Children.forEach((child) => {
            this.AddAllEvents(child);
        })
    }
}


export default SceneGraph;