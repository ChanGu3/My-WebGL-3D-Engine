import SceneObject from "./SceneObject";
import Engine3D from "./Engine3D";
import Key from "./InputDevices/Key";
import Time from "./Time";
import Vec3 from "./linear-algebra/Vec3";
import Keyboard from "./InputDevices/Keyboard";
import Vec4 from "./linear-algebra/Vec4";
import Mat4 from "./linear-algebra/Mat4";
import Mesh from "./rendering/Mesh";
import Texture from "./Texture";

class Scene {
    private _objects: SceneObject[] = [];

    public constructor() {
        Keyboard.getKey("KeyA").addKeyDownListener({name:"print_key", doAction(key: Key) {
                console.log(key.code);
        }});

        // cube
        const cubeObj1 = new SceneObject(Mesh.Meshes['cubeD']);
        cubeObj1.Texture = Texture.Textures['texture_map'];
        this._objects.push(cubeObj1);
        cubeObj1.transform.positon = new Vec3({X:0, Y:0, Z:0.4});
        cubeObj1.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj2 = new SceneObject(Mesh.Meshes['cubeC']);
        this._objects.push(cubeObj2);
        cubeObj2.transform.positon = new Vec3({X:0, Y:0, Z:-0.4});
        cubeObj2.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj3 = new SceneObject(Mesh.Meshes['cubeC']);
        this._objects.push(cubeObj3);
        cubeObj3.transform.positon = new Vec3({X:0.4, Y:0, Z:0});
        cubeObj3.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj4 = new SceneObject(Mesh.Meshes['cubeC']);
        this._objects.push(cubeObj4);
        cubeObj4.transform.positon = new Vec3({X:-0.4, Y:0, Z:0});
        cubeObj4.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj5 = new SceneObject(Mesh.Meshes['loaded']);
        this._objects.push(cubeObj5);
        cubeObj5.transform.positon = new Vec3({X:0, Y:5, Z:0});
    }

    private rot_amt_xz:number = 0.0;
    private readonly rot_speed_xz:number = -0.125;
    public fixedUpdate():void {
        this.rot_amt_xz += this.rot_speed_xz * Time.fixedTime;
        this._objects[4].transform.rotation = new Vec3({X:0, Y:this.rot_amt_xz, Z:0});
    }


    public get objects(): SceneObject[] {
        return this._objects;
    }

}

export default Scene;