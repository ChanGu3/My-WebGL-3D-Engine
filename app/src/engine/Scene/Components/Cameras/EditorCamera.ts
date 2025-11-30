import Keyboard from "../../../InputDevices/Keyboard";
import Vec3 from "../../../linear-algebra/Vec3";
import Vec4 from "../../../linear-algebra/Vec4";
import Time from "../../../Time";
import Camera from "./Camera";

class EditorCamera extends Camera {

    private readonly normalSpeed:number = 4;
    private spd:number = 0;

    private get spdRot() {
        return this.normalSpeed * 0.125;
    }
    /*
    *  for no clipping
    */
    public noClipControls():void {
        this.spd = this.normalSpeed;
        if(Keyboard.getKey("ShiftLeft").isPressing){
            this.spd /= 3;
        }

        const camLocalDirectionZ: Vec4 = this.SceneObject.Transform.localDirectionZ();
        const camDirection:Vec3 = new Vec3({X:camLocalDirectionZ.X, Y:camLocalDirectionZ.Y, Z:camLocalDirectionZ.Z});

        const camLocalDirectionX: Vec4 = this.SceneObject.Transform.localDirectionX();
        const camPerpDirection:Vec3 = new Vec3({X:camLocalDirectionX.X, Y:camLocalDirectionX.Y, Z:camLocalDirectionX.Z});

        // Position Changing
        let positionChange:Vec3 = new Vec3({X:0, Y:0, Z:0});
        if(Keyboard.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(this.spd * Time.FixedTime));
        }
        if(Keyboard.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(this.spd * Time.FixedTime).scaled(-1));
        }
        if(Keyboard.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(this.spd * Time.FixedTime).scaled(-1));
        }
        if(Keyboard.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(this.spd * Time.FixedTime));
        }
        // move down
        if(Keyboard.getKey("KeyC").isPressing) {
            positionChange = positionChange.add(Vec3.create(0, this.spd * Time.FixedTime, 0)).scaled(-1);
        }
        // move up
        if(Keyboard.getKey("Space").isPressing) {
            positionChange = positionChange.add(Vec3.create(0, this.spd * Time.FixedTime, 0));
        }
        this.SceneObject.Transform.position = this.SceneObject.Transform.position.add(positionChange);



        let rotationChange:Vec3 = new Vec3({X:0, Y:0, Z:0});
        // roll left
        if(Keyboard.getKey("KeyQ").isPressing) {
            rotationChange = rotationChange.add(Vec3.create(0, 0, this.spd * Time.FixedTime).scaled(-1));
        }
        // roll right
        if(Keyboard.getKey("KeyE").isPressing) {
            rotationChange = rotationChange.add(Vec3.create(0, 0, this.spd * Time.FixedTime));
        }
        // pitch up
        if(Keyboard.getKey("ArrowUp").isPressing) {
            if(this.SceneObject.Transform.rotation.X < 0.24) {
                rotationChange = rotationChange.add(Vec3.create(this.spdRot * Time.FixedTime, 0, 0));
            } else {
                this.SceneObject.Transform.rotation = Vec3.create(0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
        }
        // pitch down
        if(Keyboard.getKey("ArrowDown").isPressing) {
            if(this.SceneObject.Transform.rotation.X > -0.24) {
                rotationChange = rotationChange.add(Vec3.create(this.spdRot * Time.FixedTime, 0, 0).scaled(-1));
            } else {
                this.SceneObject.Transform.rotation = Vec3.create(-0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
        }
        // yaw left
        if(Keyboard.getKey("ArrowLeft").isPressing) {
            rotationChange = rotationChange.add(Vec3.create(0, this.spdRot * Time.FixedTime, 0));
        }
        // yaw right
        if(Keyboard.getKey("ArrowRight").isPressing) {
            rotationChange = rotationChange.add(Vec3.create(0, this.spdRot * Time.FixedTime, 0).scaled(-1));
        }
        this.SceneObject.Transform.rotation = this.SceneObject.Transform.rotation.add(rotationChange);
    }
}

export default EditorCamera;