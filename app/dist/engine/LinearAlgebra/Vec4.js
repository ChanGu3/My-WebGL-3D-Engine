class Vec4 {
    constructor(vec4) {
        var _a;
        this.x = vec4.x;
        this.y = vec4.y;
        this.z = vec4.z;
        this.w = (_a = vec4.w) !== null && _a !== void 0 ? _a : 0;
    }
    get X() {
        return this.x;
    }
    get Y() {
        return this.y;
    }
    get Z() {
        return this.z;
    }
    get W() {
        return this.w;
    }
    /**
     * Returns the length of this vector
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * Returns a normalized version of this vector
     */
    normalized() {
        const magnitude = this.magnitude;
        const normalizedVec4 = { x: this.x / magnitude, y: this.y / magnitude, z: this.z / magnitude, w: this.w / magnitude };
        return new Vec4(normalizedVec4);
    }
    /**
     * Returns the vector that is this vector scaled by the given scalar(magnitude).
     **/
    scaled(scalar) {
        const scaledVec4 = {
            x: this.x * scalar,
            y: this.y * scalar,
            z: this.z * scalar,
            w: this.w * scalar
        };
        return new Vec4(scaledVec4);
    }
    /**
     * Returns the dot product between this vector and other
     */
    dot(other) {
        const productVec4 = {
            x: this.x * other.x,
            y: this.y * other.y,
            z: this.z * other.z,
            w: this.w * other.w
        };
        return productVec4.x + productVec4.y + productVec4.z + productVec4.w;
    }
    /**
     * Returns the vector sum between this and other.
     */
    add(other) {
        const summedVec4 = {
            x: this.x + other.x,
            y: this.y + other.y,
            z: this.z + other.z,
            w: this.w + other.w
        };
        return new Vec4(summedVec4);
    }
    /**
     * Returns the vector sub between this and other.
     */
    sub(other) {
        return this.add(other.scaled(-1));
    }
    /**
     * Returns the vector cross product between this and other.
     */
    cross(other) {
        const crossProductVec4 = {
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
    toString() {
        return `${Vec4.name}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z}, ${this.w} ]`;
    }
}
export default Vec4;
//# sourceMappingURL=Vec4.js.map