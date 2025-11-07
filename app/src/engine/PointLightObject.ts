import LightObject from "./LightObject";
import ShaderProgram from "./rendering/shaders/ShaderProgram";
import Mesh from "./rendering/Mesh";

class PointLightObject extends LightObject {

    private light_coefficient:number = 1.8;

    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
    }

    public get Light_Coefficient():number {
        return this.light_coefficient;
    }

    public set Light_Coefficient(new_coefficient:number) {
        this.light_coefficient = new_coefficient;
    }
}

export default PointLightObject;