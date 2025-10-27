import Vec3, {Vec3_T} from "./linear-algebra/Vec3";
import Mat4 from "./linear-algebra/Mat4";
import mat4 from "./linear-algebra/Mat4";

class Transform {
    public positon:Vec3 = new Vec3({X:0, Y:0, Z:0});
    public scale:Vec3 = new Vec3({X:1, Y:1, Z:1});
    public rotation:Vec3 = new Vec3({X:0, Y:0, Z:0});

    constructor() {}

    public modelMatrix():Mat4 {
        return mat4.translation(this.positon.x, this.positon.y, this.positon.z).multiply(mat4.rotation_xz(this.rotation.y).multiply(mat4.rotation_yz(this.rotation.x).multiply(mat4.rotation_xy(this.rotation.z).multiply(mat4.scale(this.scale.x, this.scale.y, this.scale.z).multiply(mat4.identity())))));
    }

    public localDirectionZ() {
        return this.modelMatrix().vectorBasisZ().normalized();
    }

    public localDirectionY() {
        return this.modelMatrix().vectorBasisY().normalized();
    }

    public localDirectionX() {
        return this.modelMatrix().vectorBasisX().normalized();
    }
}

export default Transform;