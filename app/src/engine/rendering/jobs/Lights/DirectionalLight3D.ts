import Vec3 from "../../../linear-algebra/Vec3";
import Light3D from "./Light3D";

class DirectionalLight3D extends Light3D {
    private direction: Vec3;

    constructor(color: Vec3, direction: Vec3) {
        super(color);
        this.direction = direction
    }

    public get Direction(): Vec3 {
        return this.direction;
    }
}

export default DirectionalLight3D;