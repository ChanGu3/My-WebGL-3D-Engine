import Vec4, { type Vec4_T } from "./Vec4";

export type Matrix4x4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
];

export enum UniqueMatrix {
    Zero = 0,
    Identity = 1,
    RowMajor = 2,
    ColumnMajor = 3,
}

/*
ROTATIONS ARE RIGHT-HANDED: Positive turns are Counter-Clockwise
 */
class Mat4 {

    private data: Matrix4x4;

    constructor( data?: Matrix4x4|UniqueMatrix|null  ) {
            switch (data) {
                case UniqueMatrix.Zero:
                    this.data = [
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                    ]
                    break;
                case undefined:
                case null:
                case UniqueMatrix.Identity:
                    this.data = [
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1,
                    ]
                    break;
                case UniqueMatrix.RowMajor:
                    this.data = [
                        0, 1, 2, 3,
                        4, 5, 6, 7,
                        8, 9, 10, 11,
                        12, 13, 14, 15,
                    ]
                    break;
                case UniqueMatrix.ColumnMajor:
                    // GLSL
                    this.data = [
                        0, 4, 8, 12,
                        1, 5, 9, 13,
                        2, 6, 10, 14,
                        3, 7, 11, 15,
                    ]
                    break;
                default:
                    this.data = data as Matrix4x4;
            }
    }

    public getData(): Matrix4x4 {
        return this.data;
    }

    private static tau_to_radians(tau: number): number {
        return tau * Math.PI * 2;
    }

    /**
     * returns the identity matrix
     */
    public static identity(): Mat4 {
        return new Mat4();
    }

    /**
     * Returns a rotation matrix in the XY plane, rotating by the given number of turns. (around Z axis)
     *  Left Handed System
     */
    public static rotation_xy( tau:number ): Mat4 {
        const r = Mat4.tau_to_radians(tau);
        const rotationXY: Matrix4x4 = [
            Math.cos(r), Math.sin(r), 0,  0,
            -Math.sin(r), Math.cos(r),  0,  0,
            0,           0,            1,  0,
            0,           0,            0,  1
        ];
        return new Mat4(rotationXY);
    }

    /**
     * Returns a rotation matrix in the ZX plane, rotating by the given number of turns (around Y axis)
     * Left Handed System
     */
    public static rotation_xz( tau:number ): Mat4 {
        const r = Mat4.tau_to_radians(tau);
        const rotationXZ: Matrix4x4 = [
            Math.cos(r),  0, -Math.sin(r), 0,
            0,            1, 0,            0,
            Math.sin(r),  0, Math.cos(r),  0,
            0,            0, 0,            1
        ];
        return new Mat4(rotationXZ);
    }

    /**
     * returns a rotation matrix in the YZ plane, rotating by the given number of turns (around X axis)
     * Left Handed System
     **/
    public static rotation_yz( tau: number ): Mat4  {
        const r = Mat4.tau_to_radians(tau);
        const rotationYZ: Matrix4x4 = [
            1, 0,           0,             0,
            0, Math.cos(r), Math.sin(r),  0,
            0, -Math.sin(r), Math.cos(r),   0,
            0, 0,           0,             1
        ];
        return new Mat4(rotationYZ);
    }

    /**
     returns a transformation matrix of a translation in x, y, z
     */
    public static translation( dx: number, dy: number, dz: number ): Mat4 {
        const translationMatrix: Matrix4x4 = [
            1, 0, 0, dx,
            0, 1, 0, dy,
            0, 0, 1, dz,
            0, 0, 0, 1,
        ];
        return new Mat4(translationMatrix);
    }

    /**
     returns a matrix transformation that scales with the x, y, z input
     **/
    public static scale( sx:number, sy:number, sz:number ): Mat4 {
        const scaledMat4X4: Matrix4x4 = [
            sx, 0,  0,  0,
            0,  sy, 0,  0,
            0,  0,  sz, 0,
            0,  0,  0,  1
        ];
        return new Mat4(scaledMat4X4);
    }

    /*
    *  returns the perspective projection matrix using the frustum
    */
    public static frustum( left:number, right:number, bottom:number, top:number, near:number, far:number ):Mat4 {
        // these scalars will scale x,y values to the near plane
        let scale_x = 2 * near / ( right - left );
        let scale_y = 2 * near / ( top - bottom );

        // shift the eye depending on the right/left and top/bottom planes.
        // only really used for VR (left eye and right eye shifted differently).
        let t_x = ( right + left ) / ( right - left );
        let t_y = ( top + bottom ) / ( top - bottom );

        // map z into the range [ -1, 1], but with a non-linear ramp
        // see: https://learnopengl.com/Advanced-OpenGL/Depth-testing and
        // https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix and
        // http://learnwebgl.brown37.net/08_projections/projections_perspective.html
        // for more info. (note, I'm using left-handed coordinates. Some sources use right-handed).
        const c2 = (far + near) / (far - near);
        const c1 = 2 * far * near / (far - near);

        return new Mat4( [
            scale_x,    0,          t_x, 0,
            0,          scale_y,    t_y, 0,
            0,          0,          c2, -c1,
            0,          0,          1,   0,
        ] );
    }

    /*
    *  creates a perspective matrix using the frustum matrix.
    */
    public static perspectiveUsingFrustum( tau:number, aspectRatio:number, near:number, far:number ): Mat4 {
            // Gets top of the field of view by using camera view distance to the near plane
            // multiplied by the tangent of the fov in tau converted into radians divided by 2
            // to remove only half the angle for the top leaving the other half for the bottom
            // Just the slope of the
            const top = Math.tan( Mat4.tau_to_radians(tau)/2 ) * near;
            const bottom = -top;
            // Using top we can get the right side since it's the same size multiplied by the aspect ratio
            // as the top is multiplied since it's the current length from apex origin to be scaled.
            // When left and right are used for scaling x and y transformations for vertices they are squished
            // and then when they are rasterized onto the screen they stretch back to the current aspect ratio
            // representing the vertices in the correct places not stretched by the current aspect ratio .
            const right = top * aspectRatio;
            const left = -right;

            return Mat4.frustum(left, right, bottom, top, near, far);
    }

    /**
     returns the combination of two matrix transformation  in order,
     that is encoded by 'this' and the 'input' matrix transformations.
     where the 'input' is being transformed by 'this'.
     **/
    public multiply( right: Mat4 ):Mat4 {
        // ROW-MAJOR ORDER REMEMBER!
        const multipliedMat4X4: Matrix4x4 = [
            // m0
            this.data[0] * right.data[0] + this.data[1] * right.data[4] + this.data[2] * right.data[8] + this.data[3] * right.data[12],
            // m1
            this.data[0] * right.data[1] + this.data[1] * right.data[5] + this.data[2] * right.data[9] + this.data[3] * right.data[13],
            // m2
            this.data[0] * right.data[2] + this.data[1] * right.data[6] + this.data[2] * right.data[10] + this.data[3] * right.data[14],
            // m3
            this.data[0] * right.data[3] + this.data[1] * right.data[7] + this.data[2] * right.data[11] + this.data[3] * right.data[15],
            // m4
            this.data[4] * right.data[0] + this.data[5] * right.data[4] + this.data[6] * right.data[8] + this.data[7]* right.data[12],
            // m5
            this.data[4] * right.data[1] + this.data[5] * right.data[5] + this.data[6] * right.data[9] + this.data[7] * right.data[13],
            // m6
            this.data[4] * right.data[2] + this.data[5] * right.data[6] + this.data[6] * right.data[10] + this.data[7] * right.data[14],
            // m7
            this.data[4] * right.data[3] + this.data[5] * right.data[7] + this.data[6] * right.data[11] + this.data[7] * right.data[15],
            // m8
            this.data[8] * right.data[0] + this.data[9] * right.data[4] + this.data[10] * right.data[8] + this.data[11] * right.data[12],
            // m9
            this.data[8] * right.data[1] + this.data[9] * right.data[5] + this.data[10] * right.data[9] + this.data[11] * right.data[13],
            // m10
            this.data[8] * right.data[2] + this.data[9] * right.data[6] + this.data[10] * right.data[10] + this.data[11] * right.data[14],
            // m11
            this.data[8] * right.data[3] + this.data[9] * right.data[7] + this.data[10] * right.data[11] + this.data[11] * right.data[15],
            // m12
            this.data[12] * right.data[0] + this.data[13] * right.data[4] + this.data[14] * right.data[8] + this.data[15] * right.data[12],
            // m13
            this.data[12] * right.data[1] + this.data[13] * right.data[5] + this.data[14] * right.data[9] + this.data[15] * right.data[13],
            // m14
            this.data[12] * right.data[2] + this.data[13] * right.data[6] + this.data[14] * right.data[10] + this.data[15] * right.data[14],
            // m15
            this.data[12] * right.data[3] + this.data[13] * right.data[7] + this.data[14] * right.data[11] + this.data[15] * right.data[15],
        ];
        return new Mat4(multipliedMat4X4);
    }

	/**
     right multiply by column vector
	**/
    public transform( vec4: Vec4_T ) {
        return this.transform_vec( new Vec4(vec4) );
    }

    /**
     right multiply by column vector
     **/
    public transform_vec( vec4: Vec4 ): Vec4 {
        const transformedVec4: Vec4_T = {
            // m0
            x: this.data[0] * vec4.X + this.data[1] * vec4.Y + this.data[2] * vec4.Z + this.data[3] * vec4.W,
            // m4
            y: this.data[4] * vec4.X + this.data[5] * vec4.Y + this.data[6] * vec4.Z + this.data[7] * vec4.W,
            // m8
            z: this.data[8] * vec4.X + this.data[9] * vec4.Y + this.data[10] * vec4.Z + this.data[11] * vec4.W,
            // m12
            w: this.data[12] * vec4.X + this.data[13] * vec4.Y + this.data[14] * vec4.Z + this.data[15] * vec4.W,
        };
        return new Vec4(transformedVec4);
    }

    /**
     returns the entry at the row and col starting at 0 index for both col and row
     **/
    public rc( row:0|1|2|3 , col:0|1|2|3 ): number {
        return this.data[ row * 4 + col ] as number;
    }

    // inverting a 4x4 matrix is ugly, there are 16 determinants we 
    // need to calculate. Because it's such a pain, I looked it up:
    // https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
    // author: willnode
    public inverse(): Mat4 {
        // var A2323 = m.m22 * m.m33 - m.m23 * m.m32 ;
        const A2323 = this.data[10] * this.data[15] - this.data[11] * this.data[14];
        
        // var A1323 = m.m21 * m.m33 - m.m23 * m.m31 ;
        const A1323 = this.data[9] * this.data[15] - this.data[11] * this.data[13];
        
        // var A1223 = m.m21 * m.m32 - m.m22 * m.m31 ;
        const A1223 = this.data[8] * this.data[14] - this.data[10] * this.data[13];

        // var A0323 = m.m20 * m.m33 - m.m23 * m.m30 ;
        const A0323 = this.data[8] * this.data[15] - this.data[11] * this.data[12];

        // var A0223 = m.m20 * m.m32 - m.m22 * m.m30 ;
        const A0223 = this.data[8] * this.data[14] - this.data[10] * this.data[12];

        // var A0123 = m.m20 * m.m31 - m.m21 * m.m30 ;
        const A0123 = this.data[8] * this.data[13] - this.data[9] * this.data[12];

        // var A2313 = m.m12 * m.m33 - m.m13 * m.m32 ;
        const A2313 = this.data[6] * this.data[15] - this.data[7] * this.data[14];

        // var A1313 = m.m11 * m.m33 - m.m13 * m.m31 ;
        const A1313 = this.data[5] * this.data[15] - this.data[7] * this.data[13];

        // var A1213 = m.m11 * m.m32 - m.m12 * m.m31 ;
        const A1213 = this.data[5] * this.data[14] - this.data[6] * this.data[13];

        // var A2312 = m.m12 * m.m23 - m.m13 * m.m22 ;
        const A2312 = this.data[6] * this.data[11] - this.data[7] * this.data[10];

        // var A1312 = m.m11 * m.m23 - m.m13 * m.m21 ;
        const A1312 = this.data[5] * this.data[11] - this.data[7] * this.data[9];

        // var A1212 = m.m11 * m.m22 - m.m12 * m.m21 ;
        const A1212 = this.data[5] * this.data[10] - this.data[6] * this.data[9];

        // var A0313 = m.m10 * m.m33 - m.m13 * m.m30 ;
        const A0313 = this.data[4] * this.data[15] - this.data[7] * this.data[12];

        // var A0213 = m.m10 * m.m32 - m.m12 * m.m30 ;
        const A0213 = this.data[4] * this.data[14] - this.data[6] * this.data[12];
        
        // var A0312 = m.m10 * m.m23 - m.m13 * m.m20 ;
        const A0312 = this.data[4] * this.data[11] - this.data[7] * this.data[8];

        // var A0212 = m.m10 * m.m22 - m.m12 * m.m20 ;
        const A0212 = this.data[4] * this.data[10] - this.data[6] * this.data[8];

        // var A0113 = m.m10 * m.m31 - m.m11 * m.m30 ;
        const A0113 = this.data[4] * this.data[13] - this.data[5] * this.data[12];
        
        // var A0112 = m.m10 * m.m21 - m.m11 * m.m20 ;
        const A0112 = this.data[4] * this.data[9] - this.data[5] * this.data[8];
        

        const det = 
        this.data[0] * ( this.data[5] * A2323 - this.data[6] * A1323 + this.data[7] * A1223 ) -
        this.data[1] * ( this.data[4] * A2323 - this.data[6] * A0323 + this.data[7] * A0223 ) +
        this.data[2] * ( this.data[4] * A1323 - this.data[5] * A0323 + this.data[7] * A0123 ) -
        this.data[3] * ( this.data[4] * A1223 - this.data[5] * A0223 + this.data[6] * A0123 );

        const dr = 1.0 / det;

        return new Mat4( [
            dr * ( this.data[5] * A2323 - this.data[6] * A1323 + this.data[7] * A1223 ),
            dr *-( this.data[1] * A2323 - this.data[2] * A1323 + this.data[3] * A1223 ),
            dr * ( this.data[1] * A2313 - this.data[2] * A1313 + this.data[3] * A1213 ),
            dr *-( this.data[1] * A2312 - this.data[2] * A1312 + this.data[3] * A1212 ),

            dr *-( this.data[4] * A2323 - this.data[6] * A0323 + this.data[7] * A0223 ),
            dr * ( this.data[0] * A2323 - this.data[2] * A0323 + this.data[3] * A0223 ),
            dr *-( this.data[0] * A2313 - this.data[2] * A0313 + this.data[3] * A0213 ),
            dr * ( this.data[0] * A2312 - this.data[2] * A0312 + this.data[3] * A0212 ),

            dr * ( this.data[4] * A1323 - this.data[5] * A0323 + this.data[7] * A0123 ),
            dr *-( this.data[0] * A1323 - this.data[1] * A0323 + this.data[3] * A0123 ),
            dr * ( this.data[0] * A1313 - this.data[1] * A0313 + this.data[3] * A0113 ),
            dr *-( this.data[0] * A1312 - this.data[1] * A0312 + this.data[3] * A0112 ),

            dr *-( this.data[4] * A1223 - this.data[5] * A0223 + this.data[6] * A0123 ),
            dr * ( this.data[0] * A1223 - this.data[1] * A0223 + this.data[2] * A0123 ),
            dr *-( this.data[0] * A1213 - this.data[1] * A0213 + this.data[2] * A0113 ),
            dr * ( this.data[0] * A1212 - this.data[1] * A0212 + this.data[2] * A0112 ),
        ] );
    }

    /*
    returns a clone of this data
     */
    public clone(): Mat4 {
        return new Mat4(this.data);
    }

    /**
    returns a string of the matrix in rows
     **/
    toString() {
        let pieces = [ '[' ];

        for( let row = 0; row < 4; row++ ){
            pieces.push( '[' );

            for( let col = 0; col < 4; col ++ ){
                const i = (row * 4) + col;
                pieces.push( this.data[i]!.toString());
            }

            pieces.push( ']' )
        }

        pieces.push( ']' );

        return pieces.join( ' ' );
    }
}

export default Mat4;