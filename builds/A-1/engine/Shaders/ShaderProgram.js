import VertexShader from "./VertexShader.js";
import FragmentShader from "./FragmentShader.js";
class ShaderProgram {
    constructor(gl) {
        this.instance = gl.createProgram();
        this._vertexShader = new VertexShader(gl, this.instance);
        this._fragmentShader = new FragmentShader(gl, this.instance);
        gl.attachShader(this.instance, this._vertexShader.instance);
        gl.attachShader(this.instance, this._fragmentShader.instance);
    }
    get vertexShader() {
        return this._vertexShader;
    }
    get fragmentShader() {
        return this._fragmentShader;
    }
    linkProgram(gl) {
        gl.linkProgram(this.instance);
    }
    useProgram(gl) {
        gl.useProgram(this.instance);
    }
}
export default ShaderProgram;
//# sourceMappingURL=ShaderProgram.js.map