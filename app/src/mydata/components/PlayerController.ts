
import Keyboard from "../../engine/InputDevices/Keyboard";
import Vec3 from "../../engine/linear-algebra/Vec3";
import Vec4 from "../../engine/linear-algebra/Vec4";
import SceneObject from "../../engine/Scene/SceneObject";
import Time from "../../engine/Time";
import GenerateWorld from "./GenerateWorld";

class PlayerController extends SceneObject.Component 
{
    public WorldGenerator: GenerateWorld|null = null;

    public Update(): void {
        this.Controls();
        if(this.WorldGenerator && this.WorldGenerator.IsOutOfBounds(this.SceneObject.WorldPosition)) {
            console.log("Out of Bounds - Resetting Position");
            this.SceneObject.Transform.position = Vec3.create(this.WorldGenerator.SceneObject.Transform.position.X,this.SceneObject.Transform.position.Y, this.WorldGenerator.SceneObject.Transform.position.Z-2.5);
        }
    }

    private readonly normalSpeed:number = 2.5;
    private sensitivity:number = 0.475;

    /*
    *  for no clipping
    */
    public Controls():void {
        let spd = this.normalSpeed;
        if(Keyboard.getKey("ShiftLeft").isPressing){
            spd *= 2.75;
        }

        const camDirection:Vec3 = this.SceneObject.Transform.localDirectionZ().Vec3().mul(Vec3.create(1,0,1)).normalized();
        const camPerpDirection:Vec3 = this.SceneObject.Transform.localDirectionX().Vec3().mul(Vec3.create(1,0,1)).normalized();

        // Position Changing
        let positionChange:Vec3 = new Vec3({X:0, Y:0, Z:0});
        if(Keyboard.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(spd * Time.DeltaTime));
        }
        if(Keyboard.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(spd * Time.DeltaTime).scaled(-1));
        }
        if(Keyboard.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(spd * Time.DeltaTime).scaled(-1));
        }
        if(Keyboard.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(spd * Time.DeltaTime));
        }
        this.SceneObject.Transform.position = this.SceneObject.Transform.position.add(positionChange);



        let rotationChange:Vec3 = new Vec3({X:0, Y:0, Z:0});
        // pitch up
        if(Keyboard.getKey("ArrowUp").isPressing) {
            if(this.SceneObject.Transform.rotation.X < 0.24) {
                rotationChange = rotationChange.add(Vec3.create(this.sensitivity * 0.65 * Time.DeltaTime, 0, 0));
            } else {
                this.SceneObject.Transform.rotation = Vec3.create(0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
        }
        // pitch down
        if(Keyboard.getKey("ArrowDown").isPressing) {
            if(this.SceneObject.Transform.rotation.X > -0.24) {
                rotationChange = rotationChange.add(Vec3.create(this.sensitivity * 0.65 * Time.DeltaTime, 0, 0).scaled(-1));
            } else {
                this.SceneObject.Transform.rotation = Vec3.create(-0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
        }
        // yaw left
        if(Keyboard.getKey("ArrowLeft").isPressing) {
            rotationChange = rotationChange.add(Vec3.create(0, this.sensitivity * Time.DeltaTime, 0));
        }
        // yaw right
        if(Keyboard.getKey("ArrowRight").isPressing) {
            rotationChange = rotationChange.add(Vec3.create(0, this.sensitivity * Time.DeltaTime, 0).scaled(-1));
        }
        this.SceneObject.Transform.rotation = this.SceneObject.Transform.rotation.add(rotationChange);
    }
}

export default PlayerController;