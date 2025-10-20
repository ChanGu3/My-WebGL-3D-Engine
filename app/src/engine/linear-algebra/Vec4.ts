export type Vec4_T = {
    X: number,
    Y: number,
    Z: number,
    W: number,
};

class Vec4 {

    private readonly x: number;
    private readonly y: number;
    private readonly z: number;
    private readonly w: number;

    constructor( vec4: Vec4_T ) {
        this.x = vec4.X;
        this.y = vec4.Y;
        this.z = vec4.Z;
        this.w = vec4.W ?? 0;
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }

    public get Z(): number {
        return this.z;
    }

    public get W(): number {
        return this.w;
    }

    /**
     * Returns the length of this vector
     */
    public get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    /**
     * Returns a normalized version of this vector
     */
    public normalized(): Vec4 {
        const magnitude:number = this.magnitude;
        const normalizedVec4: Vec4_T = { X:this.x/magnitude, Y:this.y/magnitude, Z:this.z/magnitude, W:this.w/magnitude };
        return new Vec4(normalizedVec4);
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar(magnitude).
     **/
    public scaled( scalar: number ): Vec4 {
        const scaledVec4: Vec4_T = {
            X:this.x * scalar,
            Y:this.y * scalar,
            Z:this.z * scalar,
            W:this.w * scalar
        };
        return new Vec4(scaledVec4);
    }

    /**
     * Returns the dot product between this vector and other
     */
    public dot( other: Vec4 ) :number {
        const productVec4: Vec4_T = {
            X:this.x * other.x,
            Y:this.y * other.y,
            Z:this.z * other.z,
            W:this.w * other.w
        }
        return productVec4.X + productVec4.Y + productVec4.Z + productVec4.W;
    }

    /**
     * Returns the vector sum between this and other.
     */
    public add( other: Vec4 ): Vec4 {
        const summedVec4: Vec4_T = {
            X:this.x + other.x,
            Y:this.y + other.y,
            Z:this.z + other.z,
            W:this.w + other.w
        }
        return new Vec4(summedVec4);
    }

    /**
     * Returns the vector sub between this and other.
     */
    public sub( other: Vec4 ): Vec4 {
        return this.add( other.scaled( -1 ) );
    }

    /**
     * Returns the vector cross product between this and other.
     */
    public cross( other: Vec4 ): Vec4 {
        const crossProductVec4: Vec4_T = {
            X: this.y * other.z - this.z * other.y,
            Y: this.x * other.z - this.z * other.x,
            Z: this.x * other.y - this.y * other.x,
            W: 0
        };
        return new Vec4(crossProductVec4);
    }

    /**
     * Returns the vector values as a string.
     */
	public toString():string {
		return `${Vec4}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z}, ${this.w} ]`;
	}
}

export default Vec4;