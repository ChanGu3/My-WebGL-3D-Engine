
import Keyboard from "../../engine/InputDevices/Keyboard";
import Mat4 from "../../engine/linear-algebra/Mat4";
import Vec3 from "../../engine/linear-algebra/Vec3";
import Vec4 from "../../engine/linear-algebra/Vec4";
import Render3D from "../../engine/rendering/jobs/Render3D";
import Mesh from "../../engine/rendering/Mesh";
import Texture from "../../engine/rendering/Texture";
import PointLight from "../../engine/Scene/Components/Lights/PointLight";
import Renderer3D from "../../engine/Scene/Components/Renderer3D";
import SceneObject from "../../engine/Scene/SceneObject";
import Transform from "../../engine/Scene/Transform";
import Time from "../../engine/Time";
import GameManager from "./GameManager";

class LightOrbPrefab extends SceneObject.Component 
{

    private cubeLight: null|SceneObject = null;
    private sphere: null|SceneObject = null;
    public override FixedUpdate() {
        if(this.cubeLight) {
            this.cubeLight.Transform.rotation = Vec3.create(
                -(Time.TimeElapsed/10000) % 1, 
                (Time.TimeElapsed/10000) % 1,
                (Time.TimeElapsed/9000) % 1,
            );
        }

        this.RotateAroundParent(this.MaxLengthFromCenter, this.Speed);
        this.checkForParentMoveThenRotate();
    }

    public override Start() {
        this.CreateObject();
    }

    private CreateObject() {
        this.sphere = new SceneObject("sphere");
        const sphere1_3DRenderer = this.sphere.addComponent(Renderer3D);
        sphere1_3DRenderer.Mesh = Mesh.Meshes['sphere'];
        sphere1_3DRenderer.Material.Ambient = 1;
        sphere1_3DRenderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(1,1,1,0.1));
        this.sphere.setParent(this.SceneObject);

        this.cubeLight = new SceneObject("PointLight");
        this.cubeLight.Transform.position = Vec3.create(0,0,0);
        this.cubeLight.Transform.scale = Vec3.create(0.25,0.25,0.25);
        const light2_3DRenderer = this.cubeLight.addComponent(Renderer3D);
        light2_3DRenderer.Mesh = Mesh.Meshes['cubeD'];
        light2_3DRenderer.Material.Ambient = 1;
        light2_3DRenderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(1,1,1,1));
        const light2_POINTLIGHT = this.cubeLight.addComponent(PointLight);
        light2_POINTLIGHT.Light_Coefficient = 1.8;
        this.cubeLight.setParent(this.sphere);
    }

    public IsRotatingParentX:boolean = false; // must use X and Some Z or Y since its direction is being used for rotation
    public IsRotatingParentY:boolean = false;
    public IsRotatingParentZ:boolean = false;
    public MaxLengthFromCenter:number = 1;
    public Speed:number = 1;
    public set Color(vec3: Vec3) {
        if(this.cubeLight) {
            const light = this.cubeLight.getComponent(PointLight);
            if(light) {
                light.Color = vec3;
            }
            const renderer = this.cubeLight.getComponent(Renderer3D);
            if(renderer) {
                renderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(vec3.X, vec3.Y, vec3.Z, 0.1));
            }
        }

        if(this.sphere && this.sphere.getComponent(Renderer3D)) {
            const renderer = this.sphere.getComponent(Renderer3D);
            if(renderer) {
                renderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(vec3.X, vec3.Y, vec3.Z, 0.1));
            }
        }
    }

    public set LightIntensity(num: number) {
        if(this.cubeLight) {
            const light = this.cubeLight.getComponent(PointLight);
            if(light) {
                light.Light_Coefficient = num;
            }
        }
    }

    private offsetrot: number = Math.random() * 1000000000;
    private RotateAroundParent(maxLengthFromCenter: number, speed: number) {

        if(this.SceneObject.Parent && (this.IsRotatingParentY || this.IsRotatingParentZ)) {
            this.SceneObject.Transform.position = Transform.GetRotationMatrix(Vec3.create(
                (this.IsRotatingParentX) ? ((Math.sin((Time.TimeElapsed + (this.offsetrot)) / (12000/speed))) * 0.15) : 0,  // X tilt changes over time
                0,
                (this.IsRotatingParentZ) ? ((Math.cos((Time.TimeElapsed + (this.offsetrot)) / (14000/speed)) % 1) * 0.1) : 0
            )).transform_vec(
                Transform.GetRotationMatrix(Vec3.create(
                    0,
                    (this.IsRotatingParentY) ? (((Time.TimeElapsed + (this.offsetrot)) / (10000/speed)) % 1) : 0,
                    0
                )).transform_vec(Vec4.create(maxLengthFromCenter, 0, 0, 0))
            ).Vec3();
        }
    }

    private toBeParent: SceneObject|null = null;
    public MoveToObjectThanMakeParentThenRotate(SceneObjectToMoveTo: SceneObject) {
        this.IsRotatingParentY = false;
        this.toBeParent = SceneObjectToMoveTo;
    }

    private checkForParentMoveThenRotate() {
        if(this.toBeParent) {
            this.SceneObject.Transform.position = this.SceneObject.Transform.position.add(this.toBeParent.WorldPosition.sub(this.SceneObject.Transform.position).normalized().normalized().scaled(Time.DeltaTime * 4));
        
            if(LightOrbPrefab.IsWithinDistanceBetweenTwoObjects(this.SceneObject, this.toBeParent, 0.8)) {
                    this.SceneObject.Transform.position = Vec3.create(0, 0, 0);
                    this.Transform.scale = Vec3.create(0.1, 0.1, 0.1);
                    this.MaxLengthFromCenter = 0.075 + (Math.random() * 0.35);
                    this.Speed = 2.5;
                    this.toBeParent.addChild(this.SceneObject);
                    this.IsRotatingParentZ = this.IsRotatingParentY =  this.IsRotatingParentX = true;      
                    this.toBeParent = null;   
                    if(this.cubeLight) {
                        this.cubeLight.getComponent(PointLight)?.DisableLight(); 
                    }
            }
        }
    }

    public static IsWithinDistanceBetweenTwoObjects(obj1: SceneObject, obj2: SceneObject, distance:number = 5): boolean {
        return obj1.WorldPosition.sub(obj2.WorldPosition).magnitude <= distance;
    }
}

export default LightOrbPrefab;