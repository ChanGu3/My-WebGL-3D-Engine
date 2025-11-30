
import Keyboard from "../../engine/InputDevices/Keyboard";
import Vec3 from "../../engine/linear-algebra/Vec3";
import Vec4 from "../../engine/linear-algebra/Vec4";
import Render3D from "../../engine/rendering/jobs/Render3D";
import Mesh from "../../engine/rendering/Mesh";
import Texture from "../../engine/rendering/Texture";
import PointLight from "../../engine/Scene/Components/Lights/PointLight";
import Renderer3D from "../../engine/Scene/Components/Renderer3D";
import SceneObject from "../../engine/Scene/SceneObject";
import Time from "../../engine/Time";
import LightOrbPrefab from "./LightOrbPrefab";

class CenterArea extends SceneObject.Component 
{
    private centerSphere: null|SceneObject = null;
    private sphereStart = Vec3.create(0,0,0);

    public override Update() {
        
        if(this.centerSphere) {
            this.centerSphere.Transform.position = Vec3.create(
                this.centerSphere.Transform.position.X, 
                this.sphereStart.Y + Math.abs(Math.cos((Time.TimeElapsed/900) % (Math.PI * 2))),
                this.centerSphere.Transform.position.Z
            );
        }
    }

    public override Start() {
        this.Setup();
    }

    public get CenterSphere(): SceneObject|null {
        return this.centerSphere;
    }

    private Setup() {
        const centerCube =  new SceneObject("CenterCube");
        centerCube.Transform.scale = Vec3.create(1,1,1);
        const cubeRender = centerCube.addComponent(Renderer3D);
        cubeRender.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0.502, 0.502, 0.502,1));
        cubeRender.Mesh = Mesh.Meshes['cubeD'];
        centerCube.setParent(this.SceneObject);
        
        // FOR SIGN
        const sign =  new SceneObject("sign");
        sign.Transform.position = Vec3.create(0,0.1,-0.38);
        sign.Transform.scale = Vec3.create(0.75,0.75,0.25);
        const signRender = sign.addComponent(Renderer3D);
        signRender.Mesh = Mesh.Meshes['cubeD']
        signRender.Material.Texture = Texture.Textures['sign'];
        sign.setParent(centerCube);


        this.centerSphere = new SceneObject("lightorb");
        const lightorbprefab = this.centerSphere.addComponent(LightOrbPrefab);
        lightorbprefab.Start();
        lightorbprefab.LightIntensity = 1.4;
        this.centerSphere.Transform.position = Vec3.create(0,0,0);
        this.centerSphere.setParent(centerCube);
        this.centerSphere.getChild(0)!.getChild(0)!.Transform.scale = Vec3.create(0.1,0.1,0.1);
        this.sphereStart = this.centerSphere.Transform.position = Vec3.create(0,1,0);
    }
}

export default CenterArea;