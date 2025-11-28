import Vec3 from "../../../linear-algebra/Vec3";
import SceneObject from "../../SceneObject";


abstract class Light extends SceneObject.Component {

    private color:Vec3 = Vec3.create(1,1,1);

    public get Color() {
        return this.color;
    }

    public set Color(color: Vec3) {
        this.color = color;
    }
}

export default Light;