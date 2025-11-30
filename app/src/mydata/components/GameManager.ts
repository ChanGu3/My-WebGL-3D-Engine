import Keyboard from "../../engine/InputDevices/Keyboard";
import Vec3 from "../../engine/linear-algebra/Vec3";
import SceneObject from "../../engine/Scene/SceneObject";
import CenterArea from "./CenterArea";
import GenerateWorld from "./GenerateWorld";
import LightOrbPrefab from "./LightOrbPrefab";
import PlayerController from "./PlayerController";

class GameManager extends SceneObject.Component 
{
    public GenerateWorld: GenerateWorld|null = null;
    public PlayerController: PlayerController|null = null;
    public CenterArea: CenterArea|null = null;

    private currentLightObject: SceneObject|null = null;

    public override Start() {
        //currentLightObject = 
    }

    public override Update() {
        this.CheckForNearbyLightOrb();
        this.AddANewCurrentLightObjectIfGone();
    }

    private AddANewCurrentLightObjectIfGone(){
        if(this.currentLightObject === null && this.GenerateWorld) {
            const lightSpawns = this.GenerateWorld.TreeHolder;
            if(lightSpawns) {
                const lightSpawn = lightSpawns.getChild(Math.floor(Math.random() * (lightSpawns.Children.length-1)));
                this.currentLightObject = new SceneObject("LightOrbPickup");
                this.currentLightObject.Transform.scale =  Vec3.create(1.75 * 0.5, 0.25 * 0.5, 1.75 * 0.5);
                const lightorbC = this.currentLightObject.addComponent(LightOrbPrefab);
                lightorbC.Start();
                lightorbC.LightIntensity = 3.9;
                lightorbC.MaxLengthFromCenter = 2;
                const randomVec3 = Vec3.create(Math.random(),Math.random(), Math.random());
                lightorbC.Color = randomVec3;
                lightorbC.IsRotatingParentY = true;
                lightSpawn?.addChild(this.currentLightObject);
            }
        }
    }

    private CheckForNearbyLightOrb() {
        if(this.currentLightObject && this.PlayerController && this.CenterArea && this.CenterArea.CenterSphere) {
            if(Keyboard.getKey("KeyE").isPressing && GameManager.IsWithinDistanceBetweenTwoObjects(this.currentLightObject, this.PlayerController.SceneObject, 0.8)) {
                    this.currentLightObject.Transform.position = this.currentLightObject.WorldPosition;
                    this.currentLightObject.Transform.scale = Vec3.create(0.1, 0.1, 0.1);
                    this.currentLightObject.setParent(this.currentLightObject.Root)
                    this.currentLightObject.getComponent(LightOrbPrefab)?.MoveToObjectThanMakeParentThenRotate(this.CenterArea.CenterSphere);
                    this.currentLightObject = null;
            }
        }
    }

    public static IsWithinDistanceBetweenTwoObjects(obj1: SceneObject, obj2: SceneObject, distance:number = 5): boolean {
        return obj1.WorldPosition.sub(obj2.WorldPosition).magnitude <= distance;
    }
}

export default GameManager;
