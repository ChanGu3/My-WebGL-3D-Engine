import Mat4 from "../../linear-algebra/Mat4";
import Render3D from "../../rendering/jobs/Render3D";
import Material from "../../rendering/Material";
import Mesh from "../../rendering/Mesh";
import Renderer from "../../rendering/Renderer";
import ShaderProgram from "../../rendering/shaders/ShaderProgram";
import SceneObject from "../SceneObject";

class Renderer3D extends SceneObject.Component {
    private mesh: Mesh|null = null;
    private shaderProgram: ShaderProgram|null = null;
    private material: Material = new Material();

    public set ShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }

    public get Material() {
        return this.material;
    }

    public set Material(material: Material) {
        this.material = material;
    }

    public set Mesh(mesh: Mesh) {
        this.mesh = mesh;
    }

    /*
    *  renders the object every frame.
    */
    public add_render_job(relativeMat4: Mat4 = Mat4.identity()):void {
        if(this.mesh && this.shaderProgram) {
            Renderer.AddRenderJob(new Render3D(this.shaderProgram, relativeMat4, this.mesh, this.material));
        }
    }
}

export default Renderer3D;