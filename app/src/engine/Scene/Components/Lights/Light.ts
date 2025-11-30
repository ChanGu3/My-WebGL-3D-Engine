import Vec3 from "../../../linear-algebra/Vec3";
import SceneObject from "../../SceneObject";


abstract class Light extends SceneObject.Component {

    private color:Vec3 = Vec3.create(1,1,1);
    private isLightDisabled: boolean = false;

    public get Color() {
        return this.color;
    }

    public set Color(color: Vec3) {
        this.color = color;
    }

    public get IsLightDisabled(): boolean {
        return this.isLightDisabled;
    }

    public DisableLight() {
        this.isLightDisabled = true;
    }

    public EnableLight() {
        this.isLightDisabled = false;
    }
}

export default Light;