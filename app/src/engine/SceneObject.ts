import Mesh from "./rendering/Mesh";
import Transform from "./Transform";
import Material from "./rendering/Material";
import Editor from "./Editor";
import ShaderProgram from "./rendering/shaders/ShaderProgram";
import Vec3 from "./linear-algebra/Vec3";

type ObjectIdentifier = {
    light:SceneObject;
    type:string;
}
class SceneObject {
    public static lights: ObjectIdentifier[] = [];

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

    public get Mesh() {
        return this.mesh;
    }

    public set Mesh(mesh: Mesh) {
        this.mesh = mesh;
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
            this.shaderProgram.setPhongLighting(this.material.Ambient, this.material.Diffuse, this.material.Specular, this.material.Shininess);

            let directionalLightsCount = 0;
            const directional_light_dir_list:number[] = [];
            const directional_light_color_list:number[] = [];

            let pointLightsCount = 0;
            const point_light_pos_list:number[] = [];
            const point_light_color_list:number[] = [];
            const point_light_coefficient_list:number[] = [];

            let light:SceneObject;
            let color:Vec3;
            for(let i = 0; i < SceneObject.lights.length; i++) {
                switch(SceneObject.lights[i].type) {
                    case "DirectionalLightObject":
                        light  = SceneObject.lights[i].light;
                        let rotation:Vec3 = light.transform.rotation.normalized();
                        color = light['Color'];
                        directionalLightsCount++;
                        directional_light_dir_list.push(rotation.X, rotation.Y, rotation.Z);
                        directional_light_color_list.push(color.X, color.Y, color.Z);
                        break;
                    case "PointLightObject":
                        light  = SceneObject.lights[i].light;
                        let position:Vec3 = light.transform.positon;
                        color = light['Color'];
                        pointLightsCount++;
                        point_light_pos_list.push(position.X, position.Y, position.Z);
                        point_light_color_list.push(color.X, color.Y, color.Z);
                        point_light_coefficient_list.push(light['Light_Coefficient']);
                        break;
                }
            }
            if(directionalLightsCount > 0) {
                this.shaderProgram.setDirectionalLights(directional_light_dir_list, directional_light_color_list, directionalLightsCount);
            }
            if(pointLightsCount > 0) {
                this.shaderProgram.setPointLights(point_light_pos_list, point_light_color_list, point_light_coefficient_list, pointLightsCount);
            }


            this.mesh.drawMesh();

            this.mesh.unbind();
            this.material.unbind();
            ShaderProgram.UnloadAny();
        }
    }
}

export default SceneObject;