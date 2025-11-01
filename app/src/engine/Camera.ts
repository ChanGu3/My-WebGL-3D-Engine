import SceneObject from "./SceneObject";
import Mat4 from "./linear-algebra/Mat4";
import Vec3, {Vec3_T} from "./linear-algebra/Vec3";
import mat4 from "./linear-algebra/Mat4";
import Keyboard from "./InputDevices/Keyboard";
import Vec4 from "./linear-algebra/Vec4";
import Time from "./Time";
import Vec2, {Vec2_T} from "./linear-algebra/Vec2";

class Camera extends SceneObject{

    /*
     *  returns the perspective projection matrix defined by a frustum
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
    *  returns the perspective projection matrix defined by a perspective using the frustum matrix.
    */
    public static perspectiveUsingFrustum( tau:number, aspectRatio:number, near:number, far:number, offset:Vec2|Vec2_T = new Vec2({X:0, Y:0}) ): Mat4 {
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
        const scale:Vec3_T = {
            X: (this.transform.scale.x === 0) ? 0 : 1/this.transform.scale.x,
            Y: (this.transform.scale.y === 0) ? 0 : 1/this.transform.scale.y,
            Z: (this.transform.scale.z === 0) ? 0 : 1/this.transform.scale.z
        }

        const translationMat = mat4.translation(-this.transform.positon.x, -this.transform.positon.y, -this.transform.positon.z);
        const rotationMat = mat4.rotation_xy(-this.transform.rotation.z).multiply(mat4.rotation_yz(-this.transform.rotation.x).multiply(mat4.rotation_xz(-this.transform.rotation.y)));

        const scaleMat = mat4.scale(scale.X, scale.Y, scale.Z);
        return mat4.identity().multiply(scaleMat.multiply(rotationMat.multiply(translationMat)));
    }

    private static normalSpeed:number = 0.125;
    private static spd:number = 0;
    /*
    *  controls for noclipping mainly for the editor camera
    */
    public noClipControls():void {

        Camera.spd = Camera.normalSpeed;
        if(Keyboard.getKey("ShiftLeft").isPressing){
            Camera.spd *= 2.5;
        }

        const camLocalDirectionZ: Vec4 = this.transform.localDirectionZ();
        const camDirection:Vec3 = new Vec3({X:camLocalDirectionZ.X, Y:camLocalDirectionZ.Y, Z:camLocalDirectionZ.Z});

        const camLocalDirectionX: Vec4 = this.transform.localDirectionX();
        const camPerpDirection:Vec3 = new Vec3({X:camLocalDirectionX.X, Y:camLocalDirectionX.Y, Z:camLocalDirectionX.Z});

        let positionChange:Vec3 = new Vec3({X:0, Y:0, Z:0});
        if(Keyboard.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(Camera.spd * Time.fixedTime));
        }

        if(Keyboard.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(Camera.spd * Time.fixedTime).scaled(-1));
        }

        if(Keyboard.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(Camera.spd * Time.fixedTime).scaled(-1));
        }

        if(Keyboard.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(Camera.spd * Time.fixedTime));
        }

        this.transform.positon = this.transform.positon.add(positionChange);

        // move down
        if(Keyboard.getKey("KeyC").isPressing) {
            this.transform.positon.y -= Camera.spd * Time.fixedTime;
        }

        // move up
        if(Keyboard.getKey("Space").isPressing) {
            this.transform.positon.y += Camera.spd * Time.fixedTime;
        }

        // roll left
        if(Keyboard.getKey("KeyQ").isPressing) {
            this.transform.rotation.z -= Camera.spd * Time.fixedTime;
        }

        // roll right
        if(Keyboard.getKey("KeyE").isPressing) {
            this.transform.rotation.z += Camera.spd * Time.fixedTime;
        }

        // pitch up
        if(Keyboard.getKey("ArrowUp").isPressing) {
            if(this.transform.rotation.x < 0.24) {
                this.transform.rotation.x += Camera.spd * Time.fixedTime;
            } else {
                this.transform.rotation.x = 0.24;
            }
        }

        // pitch down
        if(Keyboard.getKey("ArrowDown").isPressing) {
            if(this.transform.rotation.x > -0.24) {
                this.transform.rotation.x -= Camera.spd * Time.fixedTime;
            } else {
                this.transform.rotation.x = -0.24;
            }
        }

        // yaw left
        if(Keyboard.getKey("ArrowLeft").isPressing) {
            this.transform.rotation.y += Camera.spd * Time.fixedTime;
        }

        // yaw right
        if(Keyboard.getKey("ArrowRight").isPressing) {
            this.transform.rotation.y -= Camera.spd * Time.fixedTime;
        }
    }
}

export default Camera;