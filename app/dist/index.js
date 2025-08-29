import Engine3D from "./engine/Engine3D.js";
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');
const engine = new Engine3D(gl);
const vert_s = [
    //bottom-left
    -0.5, 0.5, 0, 1, 0.98, 0, 1.0, //left-t
    0.5, 0.5, 0, 0, 0, 1, 1.0, //right-t
    -0.5, -0.5, 0, 1, 0, 0, 1.0, //left-b
    //top-right
    0.5, 0.5, 0, 0, 0, 1, 1.0, //right-t
    0.5, -0.5, 0, 0, 1, 0, 1.0, // right-b
    -0.5, -0.5, 0, 1, 0, 0, 1.0, //left-b
];
engine.DrawOnceByInterleavedAttributes(vert_s);
//# sourceMappingURL=index.js.map