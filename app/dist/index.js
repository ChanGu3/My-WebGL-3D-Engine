import Engine3D from "./engine/Engine3D.js";
import Mat4 from "./engine/LinearAlgebra/Mat4.js";
import Vec4 from "./engine/LinearAlgebra/Vec4.js";
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');
const engine = new Engine3D(gl);
const vert_s = [
    //bottom-left
    0, 0.5, 0, 1, 0.98, 0, 1.0, //left-t
    0.5, -0.5, 0, 0, 0, 1, 1.0, //right-t
    -0.5, -0.5, 0, 1, 0, 0, 1.0, //left-b
];
engine.DrawOnce(vert_s);
//# sourceMappingURL=index.js.map