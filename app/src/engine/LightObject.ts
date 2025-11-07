import SceneObject from "./SceneObject";
import ShaderProgram from "./rendering/shaders/ShaderProgram";
import Vec3 from "./linear-algebra/Vec3";
import Mesh from "./rendering/Mesh";

class LightObject extends SceneObject {

    private color:Vec3 = Vec3.create(1,1,1);

    constructor(shaderProgram: ShaderProgram, mesh: Mesh|null = null) {
        super(shaderProgram, mesh);
        // @ts-ignore (constructor has the name of instance)
        SceneObject.lights.push({light: this, type: this.constructor.name});
    }

    public get Color() {
        return this.color;
    }

    public set Color(color: Vec3) {
        this.color = color;
    }
}

export default LightObject;