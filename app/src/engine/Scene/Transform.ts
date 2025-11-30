import Vec3, {Vec3_T} from "../linear-algebra/Vec3";
import Mat4 from "../linear-algebra/Mat4";
import mat4 from "../linear-algebra/Mat4";

class Transform {
    public position:Vec3 = new Vec3({X:0, Y:0, Z:0});
    public scale:Vec3 = new Vec3({X:1, Y:1, Z:1});
    public rotation:Vec3 = new Vec3({X:0, Y:0, Z:0}); // tau

    constructor() {  }

    public modelMatrix():Mat4 {
        return mat4.translation(this.position.X, this.position.Y, this.position.Z).multiply(mat4.rotation_xz(this.rotation.Y).multiply(mat4.rotation_yz(this.rotation.X).multiply(mat4.rotation_xy(this.rotation.Z).multiply(mat4.scale(this.scale.X, this.scale.Y, this.scale.Z).multiply(mat4.identity())))));
    }

    public static GetRotationMatrix(rotation:Vec3):Mat4 {
        return mat4.rotation_xz(rotation.Y).multiply(mat4.rotation_yz(rotation.X).multiply(mat4.rotation_xy(rotation.Z).multiply(mat4.identity())));
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