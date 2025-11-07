import CameraObject from "./CameraObject";
import Scene from "./Scene";
import shaderProgram from "./rendering/shaders/ShaderProgram";

class Editor {
    private static instance: Editor;

    private static camera: CameraObject;
    private static scene: Scene;

    public constructor() {
        if(Editor.instance != null) {
            throw new TypeError("There Can Only Exist One Version Of An Editor");
        }

        Editor.camera = new CameraObject(shaderProgram.ShaderPrograms['coordinate']);
        Editor.scene = new Scene();

        Editor.instance = this;
    }

    public static get Camera() {
        return this.camera;
    }

    public static get Scene() {
        return this.scene;
    }

    public static fixedUpdate():void {
        this.scene.fixedUpdate();
        this.camera.noClipControls();
    }
}

export default Editor;