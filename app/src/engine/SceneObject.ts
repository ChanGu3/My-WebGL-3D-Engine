import Mesh from "./rendering/Mesh";
import Transform from "./Transform";
import Texture from "./Texture";
import Renderer from "./rendering/Renderer";

class SceneObject {
    private mesh: Mesh;
    private texture: Texture;

    public transform: Transform = new Transform();

    constructor(mesh:Mesh|null = null) {
        this.mesh = mesh;
        this.texture = Texture.Textures['xor'];
    }

    //abstract fixedUpdate():void;
    //abstract update():void;

    /*
    *  renders the object every frame.
    */
    public render ():void {
        if(this.mesh !== null) {
            this.mesh.render(this.transform, this.texture);
        }
    }

    public set Texture( texture:Texture ) {
        this.texture = texture;
    }
}

export default SceneObject;