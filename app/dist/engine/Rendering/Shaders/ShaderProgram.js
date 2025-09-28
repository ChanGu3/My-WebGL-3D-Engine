import VertexShader from "./VertexShader.js";
import FragmentShader from "./FragmentShader.js";
import Engine3D from "../../Engine3D.js";
class ShaderProgram {
    constructor() {
        this.program = Engine3D.inst.GL.createProgram();
        this._vertexShader = new VertexShader(this.program);
        this._fragmentShader = new FragmentShader(this.program);
        Engine3D.inst.GL.attachShader(this.program, this._vertexShader.instance);
        Engine3D.inst.GL.attachShader(this.program, this._fragmentShader.instance);
        Engine3D.inst.GL.linkProgram(this.program);
        Engine3D.inst.GL.useProgram(this.program);
    }
    get vertexShader() {
        return this._vertexShader;
    }
    get fragmentShader() {
        return this._fragmentShader;
    }
}
export default ShaderProgram;
//# sourceMappingURL=ShaderProgram.js.map