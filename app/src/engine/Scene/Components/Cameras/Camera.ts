import Engine3D from "../../../Engine3D";
import Mat4 from "../../../linear-algebra/Mat4";
import Vec2, { Vec2_T } from "../../../linear-algebra/Vec2";
import { Vec3_T } from "../../../linear-algebra/Vec3";
import SceneObject from "../../SceneObject";
import Transform from "../../Transform";

class Camera extends SceneObject.Component {

    private degrees: number = 60;
    private readonly near: number = 0.025;
    private readonly far: number = 10;

    /*
     * gets the perspective matrix of this current camera
    */
    public getPerspectiveMatrix():Mat4 {
        const tau:number = Math.abs((this.degrees % 360)/360);
        return Camera.perspectiveUsingFrustum(tau, Engine3D.inst.VIEWPORT.aspectRatio, this.near, this.far)
    }

    /*
     *  returns the perspective projection matrix defined by a frustum
    */
    private static frustum( left:number, right:number, bottom:number, top:number, near:number, far:number ):Mat4 {
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
    *  returns the perspective projection matrix defined by a perspective using the frustum matrix.
    */
    private static perspectiveUsingFrustum( tau:number, aspectRatio:number, near:number, far:number, offset:Vec2|Vec2_T = new Vec2({X:0, Y:0}) ): Mat4 {
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


        return  Camera.frustum(left - offset.X, right - offset.X, bottom - offset.Y, top - offset.Y, near, far);
        //console.log(val.toString());
        //return val;
    }

    /*
    * returns the view using the camera model matrix data
    */
    public getViewInverseOfModelMatrix():Mat4 {
        return Camera.getInverseOfModelMatrix(this.SceneObject.Transform);
    }

    /*
    * returns the view using the camera model matrix data
    */
    private static getInverseOfModelMatrix(transform: Transform, isScaleInclude: boolean = true):Mat4 {
        const scale:Vec3_T = {
            X: (isScaleInclude) ? ((transform.scale.X === 0) ? 0 : 1/transform.scale.X) : 1,
            Y: (isScaleInclude) ? ((transform.scale.Y === 0) ? 0 : 1/transform.scale.Y) : 1,
            Z: (isScaleInclude) ? ((transform.scale.Z === 0) ? 0 : 1/transform.scale.Z) : 1
        }

        const translationMat = Mat4.translation(-transform.position.X, -transform.position.Y, -transform.position.Z);
        const rotationMat = Mat4.rotation_xy(-transform.rotation.Z).multiply(Mat4.rotation_yz(-transform.rotation.X).multiply(Mat4.rotation_xz(-transform.rotation.Y)));
        const scaleMat = Mat4.scale(scale.X, scale.Y, scale.Z);

        const value = Mat4.identity().multiply(scaleMat.multiply(rotationMat.multiply(translationMat)));
        return value;
    }

    /*
    *  returns the view using the camera model matrix data
    */
    public getViewInverseOfWorldModelMatrix():Mat4 {
        let mat4: Mat4 = Camera.getInverseOfModelMatrix(this.Transform);
        let currObject: SceneObject|null = this.SceneObject.Parent;
        while(currObject != null) {
            mat4 = mat4.multiply(Camera.getInverseOfModelMatrix(currObject.Transform, false));
            currObject = currObject.Parent;
        }

        return mat4;
    }
}

export default Camera;