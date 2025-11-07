import Mesh from "./rendering/Mesh";
import Transform from "./Transform";
import Texture from "./rendering/Texture";
import Renderer from "./rendering/Renderer";
import Material from "./rendering/Material";
import Buffer from "./rendering/shaders/Buffer";
import Engine3D from "./Engine3D";
import CameraObject from "./CameraObject";
import Editor from "./Editor";
import Mat4 from "./linear-algebra/Mat4";
import ShaderProgram from "./rendering/shaders/ShaderProgram";
import Vec3 from "./linear-algebra/Vec3";

class SceneObject {
    private mesh: Mesh;
    private shaderProgram: ShaderProgram;
    private material: Material = new Material();
    public transform: Transform = new Transform();

    constructor(shaderProgram: ShaderProgram, mesh:Mesh|null = null) {
        this.mesh = mesh;
        this.shaderProgram = shaderProgram;
    }

    public get Material(): Material {
        return this.material;
    }
    //abstract fixedUpdate():void;
    //abstract update():void;

    /*
    *  renders the object every frame.
    */
    public render ():void {
        if(this.mesh !== null) {
            this.shaderProgram.Load();
            this.material.bind();
            this.mesh.bind()

            this.shaderProgram.setVertexAttributesToBuffer();
            this.shaderProgram.setModelUniform_Mat4x4(this.transform.modelMatrix());
            this.shaderProgram.setProjectionUniform_Mat4x4(Editor.Camera.getPerspectiveMatrix());
            this.shaderProgram.setViewUniform_Mat4x4(Editor.Camera.getViewInverseOfModelMatrix());
            this.shaderProgram.setViewPositionUniform_Mat4x4(Editor.Camera.transform.positon);
            this.shaderProgram.setPhongLighting(this.material.Ambient, this.material.Diffuse, this.material.Specular, this.material.Shininess, new Vec3({X:0,Y:0, Z:1}), Vec3.create(1,1,1));

            this.mesh.drawMesh();

            this.mesh.unbind();
            this.material.unbind();
            ShaderProgram.UnloadAny();
        }
    }
}

export default SceneObject;