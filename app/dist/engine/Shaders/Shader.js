class Shader {
    constructor(gl, shader_type, shader_source) {
        this._source_atr = {};
        this.shader = gl.createShader(shader_type);
        this.source = shader_source;
        this.loadShader(gl);
        this.compileShader(gl);
    }
    loadShader(gl) {
        gl.shaderSource(this.shader, this.source);
    }
    compileShader(gl) {
        gl.compileShader(this.shader);
    }
    addSourceAttribute(gl, shaderProgram, atr) {
        this._source_atr[`${atr}`] = { name: `${atr}`, location: () => { return gl.getAttribLocation(shaderProgram, atr); } };
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