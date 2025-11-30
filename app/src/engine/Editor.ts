import Debug from "./Debug";
import Keyboard from "./InputDevices/Keyboard";
import Vec3 from "./linear-algebra/Vec3";
import EditorCamera from "./Scene/Components/Cameras/EditorCamera";
import SceneGraph from "./Scene/SceneGraph";
import SceneObject from "./Scene/SceneObject"

/*
 * im going to use the editor as the area for updating
*/
class Editor {

    private static CameraObject: SceneObject = new SceneObject("root");
    private static isInPlay: boolean = false;
    private static isEditorCamera = true;
    public static StartEvent = new Event("EditorStartEvent");

    private static UpdateBind: any = null;
    private static FixedUpdateBind: any = null;
    private static EditorFixedUpdateBind = Editor.EditorFixedUpdate.bind(Editor);
    static {
        Editor.CameraObject.addComponent(EditorCamera);
        Editor.CameraObject.Transform.position = Vec3.create(0,1,-1.5);
        Editor.CameraObject.Transform.rotation = Vec3.create(-0.0625,0,0);
        document.addEventListener("FixedUpdate", Editor.EditorFixedUpdateBind);
        Keyboard.getKey("KeyO").addKeyDownListener({name: "PlaySceneInEditor", doAction: (key) => { Editor.play() }})
        Keyboard.getKey("KeyP").addKeyDownListener({name: "StopSceneInEditor", doAction: (key) => { Editor.stop() }})
        Keyboard.getKey("KeyL").addKeyDownListener({name: "SwitchToEditorCamera", doAction: (key) => { Debug.Log(`Current Camera Toggle: ${(Editor.isEditorCamera) ? "Editor" : "SceneGraph"}`); this.isEditorCamera = !this.isEditorCamera; }})
    }

    public static get IsEditorCamera(): boolean {
        return Editor.isEditorCamera;
    }

    public static get Camera(): EditorCamera {
        return this.CameraObject.getComponent(EditorCamera) as EditorCamera;
    }

    public static LoadSceneGraph(sceneGraphConstructor: new () => SceneGraph) {
        SceneGraph.Current = new sceneGraphConstructor();
        SceneGraph.Current.SetAsCurrent();
        this.UpdateBind = SceneGraph.Current.Update.bind(SceneGraph.Current);
        this.FixedUpdateBind = SceneGraph.Current.FixedUpdate.bind(SceneGraph.Current);
    }

    private static play() {
        if(this.isInPlay) { return; }
        this.isInPlay = true;
        if(!SceneGraph.Current) { Debug.LogWarning("Cant Play Scene If No Scene Graph Exists");  return; }
        document.addEventListener("Update", Editor.UpdateBind);
        document.addEventListener("FixedUpdate", Editor.FixedUpdateBind);
        document.dispatchEvent(Editor.StartEvent);
        if (SceneGraph.Current.Camera) {this.isEditorCamera = false;}
        Debug.Log(`Current Camera Toggle: ${(Editor.isEditorCamera) ? "Editor" : "SceneGraph"}`);
    }

    private static stop() {
        if(!this.isInPlay) { return; }
        this.isInPlay = false;
        if(!SceneGraph.Current) { Debug.LogWarning("Cant Stop Scene If No Scene Graph Exists");  return; }
        document.removeEventListener("Update", Editor.UpdateBind);
        document.removeEventListener("FixedUpdate", Editor.FixedUpdateBind);
        this.LoadSceneGraph(SceneGraph.Current.constructor as new () => SceneGraph);
        this.isEditorCamera = true;
        Debug.Log(`Current Camera Toggle: ${(Editor.isEditorCamera) ? "Editor" : "SceneGraph"}`);
    }


    private static EditorFixedUpdate() {
        if(Editor.isEditorCamera) {
            Editor.Camera.noClipControls();
        }
    }
    
}

export default Editor;