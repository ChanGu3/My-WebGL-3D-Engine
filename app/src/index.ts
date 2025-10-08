import Engine3D from "./engine/Engine3D"
import Mat4 from "./engine/LinearAlgebra/Mat4"
import Vec4 from "./engine/LinearAlgebra/Vec4"

const canvas:HTMLCanvasElement = (document.getElementById('canvas') as HTMLCanvasElement);
const gl:WebGL2RenderingContext = (canvas.getContext('webgl2') as WebGL2RenderingContext);

const engine = new Engine3D(gl);

