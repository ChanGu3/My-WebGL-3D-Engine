import Mesh from "./rendering/Mesh";
import Transform from "./Transform";

class SceneObject {
    private mesh: Mesh;

    public transform: Transform = new Transform();

    constructor(mesh:Mesh|null = null) {
        this.mesh = mesh;
    }

    //abstract fixedUpdate():void;
    //abstract update():void;

    /*
    *  renders the object every frame.
    */
    public render ():void {
        if(this.mesh !== null) {
            this.mesh.render(this.transform);
        }
    }

}

export default SceneObject;