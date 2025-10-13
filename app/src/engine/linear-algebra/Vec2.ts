export type Vec2_T = {
    X: number,
    Y: number,
};

class Vec2 {

    private readonly x: number;
    private readonly y: number;

    constructor( vec2: Vec2_T ) {
        this.x = vec2.X;
        this.y = vec2.Y;
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }

    /**
     * Returns the length of this vector
     */
    public get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns a normalized version of this vector
     */
    public normalized(): Vec2 {
        const magnitude:number = this.magnitude;
        const normalizedVec4: Vec2_T = { X:this.x/magnitude, Y:this.y/magnitude };
        return new Vec2(normalizedVec4);
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar(magnitude).
     **/
    public scaled( scalar: number ): Vec2 {
        const scaledVec4: Vec2_T = {
            X:this.x * scalar,
            Y:this.y * scalar,
        };
        return new Vec2(scaledVec4);
    }

    /**
     * Returns the vector sum between this and other.
     */
    public add( other: Vec2 ): Vec2 {
        const summedVec4: Vec2_T = {
            X:this.x + other.x,
            Y:this.y + other.y,
        }
        return new Vec2(summedVec4);
    }

    /**
     * Returns the vector sub between this and other.
     */
    public sub( other: Vec2 ): Vec2 {
        return this.add( other.scaled( -1 ) );
    }

    /**
     * Returns the vector values as a string.
     */
    public toString():string {
        return `${Vec2}(x,y): [ ${this.x}, ${this.y} ]`;
    }
}

export default Vec2;