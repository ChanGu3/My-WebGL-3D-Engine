import Engine3D from "./engine/Engine3D.js"
import Mat4 from "./engine/LinearAlgebra/Mat4.js"
import Vec4 from "./engine/LinearAlgebra/Vec4.js"

const canvas:HTMLCanvasElement = (document.getElementById('canvas') as HTMLCanvasElement);
const gl:WebGL2RenderingContext = (canvas.getContext('webgl2') as WebGL2RenderingContext);

const engine = new Engine3D(gl);

const vert_s:number[] = [
    //bottom-left
    -0.5,  0.5, 0,   1, 0.98, 0, 1.0, //left-t
     0.5,  0.5, 0,   0, 0, 1, 1.0, //right-t
    -0.5, -0.5, 0,   1, 0, 0, 1.0, //left-b

    //top-right
    0.5,  0.5, 0,   0, 0, 1, 1.0, //right-t
    0.5, -0.5, 0,   0, 1, 0, 1.0, // right-b
    -0.5, -0.5, 0,   1, 0, 0, 1.0, //left-b
];

engine.DrawOnceByInterleavedAttributes(vert_s);

const rot_xz = Mat4.rotation_xz( .25 );
const rot_xy = Mat4.rotation_xy( .25 );
const rot_yz = Mat4.rotation_yz( .25 );
const translate = Mat4.translation( 4, 3, 5 );
const scale = Mat4.scale( 2, 3, 4 );
const mul = scale.multiply( translate );
const vec = new Vec4( {x:1, y:2, z:0.5, w:1} );

console.log( 'Quarter turn XZ rotation: ', rot_xz.toString() );
console.log( 'Quarter turn XY rotation: ', rot_xy.toString() );
console.log( 'Quarter turn YZ rotation: ', rot_yz.toString() );
console.log( 'Translate by 4, 3, 5: ', translate.toString() );
console.log( 'Scale by 2, 3, 4: ', scale.toString() );
console.log( 'Translate and then scale: ', mul.toString() );
console.log( 'Transform a vector with the preceding matrix: ',
    mul.transform_vec(vec).toString() );

const vec2 = new Vec4( {x:3, y:6, z:9, w:1} );
const scaled = vec.scaled( 10 );
const dot = vec.dot( vec2 );
const length = vec2.magnitude;
const norm = vec2.normalized();
const add = vec.add( vec2 );

console.log( 'Vector multiplied by scaler: ' , scaled.toString() );
console.log( 'Vector dot vector: ', dot.toString() );
console.log( 'Vector length: ', length );
console.log( 'Vector norm: ', norm.toString() );
console.log( 'Vector add: ', add.toString() );

const rot_xz2 = Mat4.rotation_xz( .125 );
const rot_xy2 = Mat4.rotation_xy( .125 );
const rot_yz2 = Mat4.rotation_yz( .125 );
const translate2 = Mat4.translation( -1, 9, 3 );
const scale2 = Mat4.scale( 0.2, -0.1, 19 );
const mul2 = scale2.multiply( translate2 );
const vec3 = new Vec4( {x:3, y:-3, z:2, w:0} );

console.log( '1/8th turn XZ rotation: ', rot_xz2.toString() );
console.log( '1/8th turn XY rotation: ', rot_xy2.toString() );
console.log( '1/8th turn YZ rotation: ', rot_yz2.toString() );
console.log( 'Translate by -1, 9, 3: ', translate2.toString() );
console.log( 'Scale by 0.2, -0.1, 19: ', scale2.toString() );
console.log( 'Translate and then scale: ', mul2.toString() );
console.log( 'Transform a vector with the preceding matrix: ',
    mul2.transform_vec(vec3).toString() );

const vec4 = new Vec4( {x:3, y:6, z:9, w:1} );
const scaled2 = vec3.scaled( 10 );
const dot2 = vec3.dot( vec4 );
const length2 = vec3.magnitude;
const norm2 = vec3.normalized();
const add2 = vec3.add( vec4 );

console.log( 'Vector multiplied by scaler: ' , scaled2.toString() );
console.log( 'Vector dot vector: ', dot2.toString() );
console.log( 'Vector length: ', length2 );
console.log( 'Vector norm: ', norm2.toString() );
console.log( 'Vector add: ', add2.toString() );