import Vec3 from "../../../linear-algebra/Vec3";
import Light3D from "./Light3D";

class PointLight3D extends Light3D {

    private lightCoefficient:number;
    private position: Vec3;

    constructor(color: Vec3, position:Vec3, lightCoefficient: number) {
        super(color);
        this.position = position;
        this.lightCoefficient = lightCoefficient;
    }

    public get LightCoefficient(): number {
        return this.lightCoefficient;
    }

    public get Position(): Vec3 {
        return this.position;
    }
}

export default PointLight3D;