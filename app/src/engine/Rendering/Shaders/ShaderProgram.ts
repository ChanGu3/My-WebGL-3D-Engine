import VertexShader from "./VertexShader.js";
import FragmentShader from "./FragmentShader.js";
import Engine3D from "../../Engine3D.js";

class ShaderProgram {
    private _vertexShader:VertexShader;
    private _fragmentShader:FragmentShader;

    private program:WebGLProgram;

    constructor() {
        this.program = Engine3D.inst.GL.createProgram();
        this._vertexShader = new VertexShader(this.program);
        this._fragmentShader = new FragmentShader(this.program);
        Engine3D.inst.GL.attachShader(this.program, this._vertexShader.instance);
        Engine3D.inst.GL.attachShader(this.program, this._fragmentShader.instance);
        Engine3D.inst.GL.linkProgram(this.program);
        Engine3D.inst.GL.useProgram(this.program);


    }

    get vertexShader(): VertexShader {
        return this._vertexShader;
    }

    get fragmentShader(): FragmentShader {
        return this._fragmentShader;
    }
}

export default ShaderProgram;