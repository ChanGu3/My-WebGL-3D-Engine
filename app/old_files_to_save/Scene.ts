import SceneObject from "./SceneObject";
import Time from "../src/engine/Time";
import Vec3 from "../src/engine/linear-algebra/Vec3";
import Mesh from "../src/engine/rendering/Mesh";
import Texture from "../src/engine/rendering/Texture";
import shaderProgram from "../src/engine/rendering/shaders/ShaderProgram";
import DirectionalLightObject from "./DirectionalLightObject";
import PointLightObject from "./PointLightObject";

class Scene {
    private _objects: SceneObject[] = [];

    public constructor() {
        const shaderD = shaderProgram.ShaderPrograms['default']
        const shaderC = shaderProgram.ShaderPrograms['coordinates']
        // cube
        const cubeObj1 = new SceneObject(shaderD,Mesh.Meshes['cubeD']);
        cubeObj1.Material.Texture = Texture.Textures['texture_map'];
        this._objects.push(cubeObj1);
        cubeObj1.transform.positon = new Vec3({X:0, Y:0, Z:-0.4});
        cubeObj1.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj2 = new SceneObject(shaderD, Mesh.Meshes['sphere']);
        cubeObj2.Material.Texture = Texture.Textures['metal_scale'];
        this._objects.push(cubeObj2);
        cubeObj2.transform.positon = new Vec3({X:0, Y:0, Z:0.4});
        cubeObj2.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj3 = new SceneObject(shaderC, Mesh.Meshes['cubeC']);
        this._objects.push(cubeObj3);
        cubeObj3.transform.positon = new Vec3({X:0.4, Y:0, Z:0});
        cubeObj3.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj4 = new SceneObject(shaderC, Mesh.Meshes['cubeC']);
        this._objects.push(cubeObj4);
        cubeObj4.transform.positon = new Vec3({X:-0.4, Y:0, Z:0});
        cubeObj4.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj5 = new SceneObject(shaderC, Mesh.Meshes['loaded']);
        this._objects.push(cubeObj5);
        cubeObj5.transform.positon = new Vec3({X:0, Y:5, Z:0});


        const dirLightObj1 = new DirectionalLightObject(shaderC);
        dirLightObj1.transform.rotation = new Vec3({X:0, Y:-0.125, Z:1});
        this._objects.push(dirLightObj1);


        const pointLightObj1 = new PointLightObject(shaderC);
        pointLightObj1.transform.positon = new Vec3({X:0, Y:-0.6, Z:1.35});
        //pointLightObj1.transform.scale = new Vec3({X:0.025, Y:0.025, Z:0.025});
        pointLightObj1.Color = Vec3.create(1,0,0.0);
        pointLightObj1.Light_Coefficient = 1.8
        this._objects.push(pointLightObj1);

        const pointLightObj2 = new PointLightObject(shaderC);
        pointLightObj2.transform.positon = new Vec3({X:100, Y:100, Z:100});
        pointLightObj2.transform.scale = new Vec3({X:0.05, Y:0.05, Z:0.05});
        pointLightObj2.Color = Vec3.create(0,1,1);
        pointLightObj2.Light_Coefficient = 1.8
        pointLightObj2.Mesh = Mesh.Meshes['sphereC'];
        this._objects.push(pointLightObj2);

        console.log(pointLightObj2.Mesh);

        const cubeObj6 = new SceneObject(shaderD,Mesh.Meshes['sphere']);
        this._objects.push(cubeObj6);
        cubeObj6.transform.positon = new Vec3({X:0, Y:5, Z:0});
        cubeObj6.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

    }

    private rot_amt_xz:number = 0.0;
    private readonly rot_speed_xz:number = -0.125;
    public fixedUpdate():void {
        this.rot_amt_xz += this.rot_speed_xz * Time.FixedTime;
        this._objects[4].transform.rotation = new Vec3({X:0, Y:this.rot_amt_xz, Z:0});

        const kettle = this._objects[8].transform.positon;

        this._objects[7].transform.positon = Vec3.create(kettle.X, kettle.Y - 0.5, kettle.Z + (Math.sin(this.rot_amt_xz * 10) * 0.25));
    }


    public get objects(): SceneObject[] {
        return this._objects;
    }

}

export default Scene;