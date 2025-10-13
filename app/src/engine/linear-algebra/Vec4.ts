export type Vec4_T = {
    x: number,
    y: number,
    z: number,
    w: number,
};

class Vec4 {

    private readonly x: number;
    private readonly y: number;
    private readonly z: number;
    private readonly w: number;

    constructor( vec4: Vec4_T ) {
        this.x = vec4.x;
        this.y = vec4.y;
        this.z = vec4.z;
        this.w = vec4.w ?? 0;
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
        const normalizedVec4: Vec4_T = { x:this.x/magnitude, y:this.y/magnitude, z:this.z/magnitude, w:this.w/magnitude };
        return new Vec4(normalizedVec4);
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar(magnitude).
     **/
    public scaled( scalar: number ): Vec4 {
        const scaledVec4: Vec4_T = {
            x:this.x * scalar,
            y:this.y * scalar,
            z:this.z * scalar,
            w:this.w * scalar
        };
        return new Vec4(scaledVec4);
    }

    /**
     * Returns the dot product between this vector and other
     */
    public dot( other: Vec4 ) :number {
        const productVec4: Vec4_T = {
            x:this.x * other.x,
            y:this.y * other.y,
            z:this.z * other.z,
            w:this.w * other.w
        }
        return productVec4.x + productVec4.y + productVec4.z + productVec4.w;
    }

    /**
     * Returns the vector sum between this and other.
     */
    public add( other: Vec4 ): Vec4 {
        const summedVec4: Vec4_T = {
            x:this.x + other.x,
            y:this.y + other.y,
            z:this.z + other.z,
            w:this.w + other.w
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
            x: this.y * other.z - this.z * other.y,
            y: this.x * other.z - this.z * other.x,
            z: this.x * other.y - this.y * other.x,
            w: 0
        };
        return new Vec4(crossProductVec4);
    }

    /**
     * Returns the vector values as a string.
     */
	public toString():string {
		return `${Vec4.name}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z}, ${this.w} ]`;
	}
}

export default Vec4;