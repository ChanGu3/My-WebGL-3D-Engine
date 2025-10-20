import SceneObject from "./SceneObject";
import Engine3D from "./Engine3D";
import Key from "./InputDevices/Key";
import Time from "./Time";
import Vec3 from "./linear-algebra/Vec3";
import Keyboard from "./InputDevices/Keyboard";
import Vec4 from "./linear-algebra/Vec4";
import Mat4 from "./linear-algebra/Mat4";

class Scene {
    public static editorCamera:SceneObject = new SceneObject();


    private _objects: SceneObject[] = [];

    public constructor() {
        Keyboard.getKey("KeyA").addKeyDownListener({name:"print_key", doAction(key: Key) {
                console.log(key.code);
        }});

        // cube
        const cubeObj1 = new SceneObject(Engine3D.inst.RENDERER.Meshes['cube']);
        this._objects.push(cubeObj1);
        cubeObj1.transform.positon = new Vec3({X:0, Y:0, Z:0.4});
        cubeObj1.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj2 = new SceneObject(Engine3D.inst.RENDERER.Meshes['cube']);
        this._objects.push(cubeObj2);
        cubeObj2.transform.positon = new Vec3({X:0, Y:0, Z:-0.4});
        cubeObj2.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj3 = new SceneObject(Engine3D.inst.RENDERER.Meshes['cube']);
        this._objects.push(cubeObj3);
        cubeObj3.transform.positon = new Vec3({X:0.4, Y:0, Z:0});
        cubeObj3.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj4 = new SceneObject(Engine3D.inst.RENDERER.Meshes['cube']);
        this._objects.push(cubeObj4);
        cubeObj4.transform.positon = new Vec3({X:-0.4, Y:0, Z:0});
        cubeObj4.transform.scale = new Vec3({X:0.15, Y:0.15, Z:0.15});

        const cubeObj5 = new SceneObject(Engine3D.inst.RENDERER.Meshes['loaded']);
        this._objects.push(cubeObj5);
        cubeObj5.transform.positon = new Vec3({X:0, Y:5, Z:0});
    }

    private rot_amt_xz:number = 0.0;
    private readonly rot_speed_xz:number = -0.125;
    public fixedUpdate():void {
        this.rot_amt_xz += this.rot_speed_xz * Time.fixedTime;
        this._objects[4].transform.rotation = new Vec3({X:0, Y:this.rot_amt_xz, Z:0});

        this.CameraMovement();
    }

    private static normalSpeed:number = 0.125;
    private static spd:number = 0;
    private CameraMovement():void {

        Scene.spd = Scene.normalSpeed;
        if(Keyboard.getKey("ShiftLeft").isPressing){
            Scene.spd *= 2.5;
        }

        const cameraMatrix:Mat4 = Scene.editorCamera.transform.getModelMatrix();
        const camFacingDirectionNorm: Vec4 = cameraMatrix.vectorBasisZ.normalized();
        const camDirection:Vec3 = new Vec3({X:camFacingDirectionNorm.X, Y:camFacingDirectionNorm.Y, Z:camFacingDirectionNorm.Z});

        const camFacingPerpDirectionNorm: Vec4 = cameraMatrix.vectorBasisX.normalized();
        const camPerpDirection:Vec3 = new Vec3({X:camFacingPerpDirectionNorm.X, Y:camFacingPerpDirectionNorm.Y, Z:camFacingPerpDirectionNorm.Z});

        let positionChange:Vec3 = new Vec3({X:0, Y:0, Z:0});
        if(Keyboard.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(Scene.spd * Time.fixedTime));
        }

        if(Keyboard.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(Scene.spd * Time.fixedTime).scaled(-1));
        }

        if(Keyboard.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(Scene.spd * Time.fixedTime).scaled(-1));
        }

        if(Keyboard.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(Scene.spd * Time.fixedTime));
        }

        Scene.editorCamera.transform.positon = Scene.editorCamera.transform.positon.add(positionChange);

        // move down
        if(Keyboard.getKey("ControlLeft").isPressing) {
            Scene.editorCamera.transform.positon.y -= Scene.spd * Time.fixedTime;
        }

        // move up
        if(Keyboard.getKey("Space").isPressing) {
            Scene.editorCamera.transform.positon.y += Scene.spd * Time.fixedTime;
        }

        // roll left
        if(Keyboard.getKey("KeyQ").isPressing) {
            Scene.editorCamera.transform.rotation.z -= Scene.spd * Time.fixedTime;
        }

        // roll right
        if(Keyboard.getKey("KeyE").isPressing) {
            Scene.editorCamera.transform.rotation.z += Scene.spd * Time.fixedTime;
        }

        // pitch up
        if(Keyboard.getKey("ArrowUp").isPressing) {
            if(Scene.editorCamera.transform.rotation.x < 0.24) {
                Scene.editorCamera.transform.rotation.x += Scene.spd * Time.fixedTime;
            } else {
                Scene.editorCamera.transform.rotation.x = 0.24;
            }
        }

        // pitch down
        if(Keyboard.getKey("ArrowDown").isPressing) {
            if(Scene.editorCamera.transform.rotation.x > -0.24) {
                Scene.editorCamera.transform.rotation.x -= Scene.spd * Time.fixedTime;
            } else {
                Scene.editorCamera.transform.rotation.x = -0.24;
            }
        }

        // yaw left
        if(Keyboard.getKey("ArrowLeft").isPressing) {
            Scene.editorCamera.transform.rotation.y += Scene.spd * Time.fixedTime;
        }

        // yaw right
        if(Keyboard.getKey("ArrowRight").isPressing) {
            Scene.editorCamera.transform.rotation.y -= Scene.spd * Time.fixedTime;
        }
    }

    public get objects(): SceneObject[] {
        return this._objects;
    }

}

export default Scene;