import Light from "./Light";

class PointLight extends Light {

    private light_coefficient:number = 1.8;

    public get Light_Coefficient():number {
        return this.light_coefficient;
    }

    public set Light_Coefficient(new_coefficient:number) {
        this.light_coefficient = new_coefficient;
    }
}

export default PointLight;