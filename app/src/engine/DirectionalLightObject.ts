import LightObject from "./LightObject";
import ShaderProgram from "./rendering/shaders/ShaderProgram";

class DirectionalLightObject extends LightObject {

    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
    }
}

export default DirectionalLightObject;