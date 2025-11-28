import Editor from "../../Editor";
import Mat4 from "../../linear-algebra/Mat4";
import Material from "../Material";
import Mesh from "../Mesh";
import Renderer from "../Renderer";
import ShaderProgram from "../shaders/ShaderProgram";

class Render3D {
    private matrix: Mat4;
    private mesh: Mesh;
    private shaderProgram: ShaderProgram;
    private material: Material;

    constructor (shaderProgram: ShaderProgram, matrix: Mat4, mesh: Mesh, material: Material) {
        this.matrix = matrix;
        this.mesh = mesh;
        this.shaderProgram = shaderProgram;
        this.material = material;
    }

    public get Matrix() {
        return this.matrix;
    }

    /*
    *  renders the object every frame.
    */
    public render ():void {
        if(this.mesh !== null) {
            this.shaderProgram.Load();
            this.material.bind();
            this.mesh.bind();

            this.shaderProgram.setVertexAttributesToBuffer();
            this.shaderProgram.setModelUniform_Mat4x4(this.matrix);
            this.shaderProgram.setProjectionUniform_Mat4x4(Renderer.Camera.getPerspectiveMatrix());
            this.shaderProgram.setViewUniform_Mat4x4(Renderer.Camera.getViewInverseOfWorldModelMatrix());
            this.shaderProgram.setViewPositionUniform_Mat4x4(Renderer.Camera.SceneObject.WorldPosition);
            this.shaderProgram.setPhongLighting(this.material.Ambient, this.material.Diffuse, this.material.Specular, this.material.Shininess);
            this.shaderProgram.setAlpha(this.material.Opaque);

            if(ShaderProgram.ShaderPrograms['default'] == this.shaderProgram) {
                Renderer.ApplyLightingToRender();
            }  

            this.mesh.drawMesh();

            this.mesh.unbind();
            this.material.unbind();
            ShaderProgram.UnloadAny();
        }
    }
}

export default Render3D;