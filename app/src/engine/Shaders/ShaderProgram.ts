import VertexShader from "./VertexShader.js";
import FragmentShader from "./FragmentShader.js";

class ShaderProgram {
    private _vertexShader:VertexShader;
    private _fragmentShader:FragmentShader;

    private instance:WebGLProgram;

    constructor(gl: WebGL2RenderingContext) {
        this.instance = gl.createProgram();
        this._vertexShader = new VertexShader(gl, this.instance);
        this._fragmentShader = new FragmentShader(gl, this.instance);
        gl.attachShader(this.instance, this._vertexShader.instance);
        gl.attachShader(this.instance, this._fragmentShader.instance);
    }

    get vertexShader(): VertexShader {
        return this._vertexShader;
    }

    get fragmentShader(): FragmentShader {
        return this._fragmentShader;
    }

    public linkProgram(gl: WebGL2RenderingContext){
        gl.linkProgram(this.instance);
    }

    public useProgram(gl: WebGL2RenderingContext){
        gl.useProgram(this.instance);
    }
}

export default ShaderProgram;