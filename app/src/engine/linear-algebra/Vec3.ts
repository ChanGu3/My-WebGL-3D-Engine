export type Vec3_T = {
    X: number,
    Y: number,
    Z: number,
};

class Vec3 {

    public x: number;
    public y: number;
    public z: number;

    constructor( vec3: Vec3_T = {X:0, Y:0, Z:0} ) {
        this.x = vec3.X;
        this.y = vec3.Y;
        this.z = vec3.Z;
    }

    /**
     * Returns the length of this vector
     */
    public get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Returns a normalized version of this vector
     */
    public normalized(): Vec3 {
        const magnitude:number = this.magnitude;
        const normalizedVec3: Vec3_T = { X:this.x/magnitude, Y:this.y/magnitude, Z:this.z/magnitude };
        return new Vec3(normalizedVec3);
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar(magnitude).
     **/
    public scaled( scalar: number ): Vec3 {
        const scaledVec4: Vec3_T = {
            X:this.x * scalar,
            Y:this.y * scalar,
            Z:this.z * scalar,
        };
        return new Vec3(scaledVec4);
    }

    /**
     * Returns the dot product between this vector and other
     */
    public dot( other: Vec3 ) :number {
        const productVec4: Vec3_T = {
            X:this.x * other.x,
            Y:this.y * other.y,
            Z:this.z * other.z,
        }
        return productVec4.X + productVec4.Y + productVec4.Z;
    }

    /**
     * Returns the vector sum between this and other.
     */
    public add( other: Vec3 ): Vec3 {
        const summedVec4: Vec3_T = {
            X:this.x + other.x,
            Y:this.y + other.y,
            Z:this.z + other.z,
        }
        return new Vec3(summedVec4);
    }

    /**
     * Returns the vector sub between this and other.
     */
    public sub( other: Vec3 ): Vec3 {
        return this.add( other.scaled( -1 ) );
    }

    /**
     * Returns the vector cross product between this and other.
     */
    public cross( other: Vec3 ): Vec3 {
        const crossProductVec4: Vec3_T = {
            X: this.y * other.z - this.z * other.y,
            Y: this.x * other.z - this.z * other.x,
            Z: this.x * other.y - this.y * other.x,
        };
        return new Vec3(crossProductVec4);
    }

    /**
     * Returns the vector values as a string.
     */
    public toString():string {
        return `${Vec3}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z} ]`;
    }
}

export default Vec3;