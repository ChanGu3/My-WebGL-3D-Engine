import Vec3 from "../../../linear-algebra/Vec3";

abstract class Light3D {
    private color: Vec3;

    constructor(color: Vec3) {
        this.color = color;     
    }

    public get Color(): Vec3 {
        return this.color;
    }
}

export default Light3D;