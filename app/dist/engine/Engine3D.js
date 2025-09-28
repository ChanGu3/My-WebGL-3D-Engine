import Buffers from "./Buffers.js";
import Renderer from "./Rendering/Renderer.js";
class Engine3D {
    constructor(gl) {
        if (Engine3D.instance !== null && Engine3D.instance !== undefined) {
            throw new Error("Cannot Have Two instances of Engine3D");
        }
        Engine3D.instance = this;
        this.gl = gl;
        this.buffers = new Buffers();
        this.renderer = new Renderer();
    }
    //
    // Gets the instance of the current running engine
    //
    static get inst() {
        if (Engine3D.instance == null) {
            throw new Error("Must Create a Instance Of Engine3D Before Using It");
        }
        return Engine3D.instance;
    }
    //
    // Gets the Rendering Context Of The Engine
    //
    get GL() {
        return this.gl;
    }
    //
    // vec3 normalized device coordinates, vec4 color
    //
    DrawOnce(vert_s) {
        this.buffers.bindVertexBuffer();
        this.renderer.DrawOnce(vert_s);
        this.buffers.unbindVertexBuffer();
    }
}
export default Engine3D;
//# sourceMappingURL=Engine3D.js.map