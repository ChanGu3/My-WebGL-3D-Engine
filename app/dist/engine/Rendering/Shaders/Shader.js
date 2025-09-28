import Engine3D from "../../Engine3D.js";
class Shader {
    constructor(shader_type, shader_source) {
        this._source_atr = {};
        this.shader = Engine3D.inst.GL.createShader(shader_type);
        this.source = shader_source;
        this.loadShader();
        this.compileShader();
    }
    loadShader() {
        Engine3D.inst.GL.shaderSource(this.shader, this.source);
    }
    compileShader() {
        Engine3D.inst.GL.compileShader(this.shader);
    }
    addSourceAttribute(shaderProgram, atr) {
        this._source_atr[`${atr}`] = { name: `${atr}`, location: () => { return Engine3D.inst.GL.getAttribLocation(shaderProgram, atr); } }; //getting attribute location can only be done when loaded into shader program
    }
    get instance() {
        return this.shader;
    }
    get source_atr() {
        return this._source_atr;
    }
}
export default Shader;
//# sourceMappingURL=Shader.js.map