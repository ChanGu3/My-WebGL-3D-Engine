import Vec3, {Vec3_T} from "./linear-algebra/Vec3";
import Mat4 from "./linear-algebra/Mat4";
import mat4 from "./linear-algebra/Mat4";

class Transform {
    public positon:Vec3 = new Vec3({X:0, Y:0, Z:0});
    public scale:Vec3 = new Vec3({X:1, Y:1, Z:1});
    public rotation:Vec3 = new Vec3({X:0, Y:0, Z:0});

    constructor() {}

    public getModelMatrix():Mat4 {
        return mat4.translation(this.positon.x, this.positon.y, this.positon.z).multiply(mat4.rotation_xz(this.rotation.y).multiply(mat4.rotation_yz(this.rotation.x).multiply(mat4.rotation_xy(this.rotation.z).multiply(mat4.scale(this.scale.x, this.scale.y, this.scale.z).multiply(mat4.identity())))));
    }

    public getCameraInverseModelMatrix():Mat4 {
        const scale:Vec3_T = {
            X: (this.scale.x === 0) ? 0 : 1/this.scale.x,
            Y: (this.scale.y === 0) ? 0 : 1/this.scale.y,
            Z: (this.scale.z === 0) ? 0 : 1/this.scale.z
        }

        const translationMat = mat4.translation(-this.positon.x, -this.positon.y, -this.positon.z);
        const rotationMat = mat4.rotation_xy(-this.rotation.z).multiply(mat4.rotation_yz(-this.rotation.x).multiply(mat4.rotation_xz(-this.rotation.y)));

        const scaleMat = mat4.scale(scale.X, scale.Y, scale.Z);
        return mat4.identity().multiply(scaleMat.multiply(rotationMat.multiply(translationMat)));
    }
}

export default Transform;