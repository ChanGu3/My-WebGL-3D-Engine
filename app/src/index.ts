import Engine3D from "./engine/Engine3D"
import Mat4 from "./engine/linear-algebra/Mat4"
import Vec4 from "./engine/linear-algebra/Vec4"

const canvas:HTMLCanvasElement = (document.getElementById('canvas') as HTMLCanvasElement);

const engine = new Engine3D(canvas);

