import Debug from "../Debug";
import Mat4 from "../linear-algebra/Mat4";
import Vec3 from "../linear-algebra/Vec3";
import Transform from "./Transform";

class SceneObject {
    private static CURRENT_ROOT_SCENE_OBJECT: SceneObject|null = null;
    public static set_ROOT_SCENE_OBJECT(root: SceneObject) {
        if(root.Parent != null) { throw new Error(`${root.name} must have no parent must set parent to null to become a ROOT_SCENE_OBJECT`); }
        this.CURRENT_ROOT_SCENE_OBJECT = root;
    }

    public static Component = class Component {

        private sceneObject: SceneObject;


        private UpdateBind = this.Update.bind(this);
        private FixedUpdateBind = this.FixedUpdate.bind(this);
        constructor(sceneObject: SceneObject) {
            this.sceneObject = sceneObject;
            if (this.sceneObject.root === SceneObject.CURRENT_ROOT_SCENE_OBJECT) { this.addExistingOverridesToEvents(); }
        }

        public addExistingOverridesToEvents() {
            if ( this.constructor.prototype["Update"] !== Component.prototype["Update"]) { document.addEventListener("SceneGraphUpdate", this.UpdateBind) }
            if ( this.constructor.prototype["FixedUpdate"] !== Component.prototype["FixedUpdate"]) { document.addEventListener("SceneGraphFixedUpdate", this.FixedUpdateBind) }
        }

        public removeExistingOverridesFromEvents() {
            if ( this.constructor.prototype["Update"] !== Component.prototype["Update"]) { document.removeEventListener("SceneGraphUpdate", this.UpdateBind) }
            if ( this.constructor.prototype["FixedUpdate"] !== Component.prototype["FixedUpdate"]) { document.removeEventListener("SceneGraphFixedUpdate", this.FixedUpdateBind) }
        }

        public get SceneObject(): SceneObject { return this.sceneObject; }
        public get Transform(): Transform { return this.SceneObject.Transform; }

        public Start(): void {} // TODO

        public Update(): void {}

        public FixedUpdate(): void {}

        public OnDestroy(): void {} // TODO
    }

    private name: string;
    private components: Map<string, SceneObjectComponent> = new Map<string, SceneObjectComponent>();
    private transform: Transform = new Transform();
    private root: SceneObject;
    private parent: SceneObject|null = null; // should only be null if root of the scene
    private children: SceneObject[] = [];
    public get Transform(): Transform { return this.transform }
    public get Root(): SceneObject { return this.root }
    public get Parent(): SceneObject|null { return this.parent; }
    public get Name(): string { return this.name }


    /*
     * use "root" as the name for a root object otherwise just use the root object creator
    */
    constructor(name: string) {
        if(name == "root") { 
            this.root = this;
            this.parent = null;
            this.name = name;
            return;
        }
        if(SceneObject.CURRENT_ROOT_SCENE_OBJECT == null) { throw new Error(`Must assign the ROOT_SCENE_OBJECT before creating a new scene object`); }

        this.root = SceneObject.CURRENT_ROOT_SCENE_OBJECT;
        SceneObject.CURRENT_ROOT_SCENE_OBJECT.addChild(this);
        this.name = name;
    }

    public get Children(): SceneObject[] {
        return this.children;
    }

    public get Components(): SceneObjectComponent[] {
        if(this.components.size === 0 ) { return [] }
        const list: SceneObjectComponent[] = [];
        const iterator = this.components.values();
        let isDone = false;
        while(!isDone) {
           const { value, done } = iterator.next();
           if(done) {
            isDone = done;
           } else {
            list.push(value);
           }
        }
        return list;
    }

    public get WorldPosition(): Vec3 {
        let pos = this.transform.position;
        let currParent: SceneObject|null = this.parent;
        while(currParent != null) {
            pos = currParent.transform.position.add(pos);
            currParent = currParent.parent;
        }
        return pos;
    }

    public get WorldModelMatrix(): Mat4 {
        const mat4s: Mat4[] = []
        let mat4 = this.transform.modelMatrix();
        let currParent: SceneObject|null = this.parent;
        while(currParent != null) {
            mat4s.push(currParent.transform.modelMatrix());
            currParent = currParent.parent;
        }
        mat4s.forEach((mat) => {
            mat4 = mat.multiply(mat4);
        })
        return mat4;
    }

    /*
     * Gets the component if it exists in components otherwise null
    */
    public getComponent<ComponentType extends SceneObjectComponent>(classType: new (sceneObject: SceneObject) => ComponentType): ComponentType | null{
        return (this.components.has(classType.name)) ? this.components.get(classType.name) as ComponentType : null;
    }

    /*
     * Adds the component and returns the component otherwise throws critical error
     * 
     * Error Causes: adding same component twice or adding component with the same class name
    */
    public addComponent<ComponentType extends SceneObjectComponent>(classType: new (sceneObject: SceneObject) => ComponentType): ComponentType {
        if(this.components.has(classType.name)) {
            if(this.components.get(classType.name) instanceof classType) { throw Error("Cannot Add The Same Component Twice"); }
            else { throw Error("cannot add component with the same class name as another component"); }
        }
        const component: ComponentType = new classType(this);
        this.components.set(classType.name, component);
        return component;
    }


    public setParent(parent: SceneObject) {
        if(SceneObject.CURRENT_ROOT_SCENE_OBJECT == this) { throw new Error(`cannot assign a parent to the ROOT_SCENE_OBJECT`); }
        parent.addChild(this);
    }

    public addChild(child: SceneObject) {
        if(child.Parent === this) { Debug.LogWarning("...", "Scene Objects", `${this.Name} is already a parent of ${child.Name}`); return } // also acts as a check for already a child of a parent
        if(this.parent === child) { Debug.LogError(`${this.Name} cannot be a parent of ${child.Name}`, "Scene Objects", `${child.Name} is a parent of ${this.Name}`); return } 
        if(SceneObject.CURRENT_ROOT_SCENE_OBJECT == child) { throw new Error(`cannot assign a ROOT_SCENE_OBJECT as a child`); }


        if(child.parent != null) { child.parent.removeChild(child); }
        this.children.push(child);
        child.parent = this;
    }

    /*
     *  returns child at index otherwise null with error if child at index does not exist
    */
    public getChild(index: number): SceneObject | null {
        if(index < 0) { Debug.LogError(`Scene Object with Name ${this.Name} attempted a get on a negative index [value: ${index}]`); return null; }
        if(this.children.length === 0) { Debug.LogError(`Scene Object With Name '${this.name}' does not have any children`); return null; }
        if(this.children.length >= index) { Debug.LogError(`Scene Object With Name '${this.name}' does not have a child at index [value: ${index}]`); return null; }

        return this.children[index];
    }

    /*
     * returns index when finding child in children otherwise it returns -1 
    */
    private findChildIndex(sceneObject: SceneObject) {
        for(let i = 0; i < this.children.length; i++)
        {
            if(this.children[i] == sceneObject) {
                return i;
            }
        }
        return -1;
    }

    private removeChild(child: SceneObject) {
        child.setIndexRelativeToParent(this.children.length-1);
        this.children.pop();
        child.parent = SceneObject.CURRENT_ROOT_SCENE_OBJECT;
    }

    public setIndexRelativeToParent(index: number) {
        if(!this.parent || SceneObject.CURRENT_ROOT_SCENE_OBJECT == this) { throw new Error(`ROOT_SCENE_OBJECT does not contain a parent to move relatively`); }
        if(index < 0) { Debug.LogError(`attempted to set index to a negative index [value: ${index}]`, "Scene Objects"); return; }
        if(this.parent.children.length === 1) { Debug.LogWarning(`attempted to move ${this.Name} but it is an only child of ${this.parent.Name}`, "Scene Objects"); return; }
        if(this.children.length >= index) { Debug.LogError(`cannot move '${this.name}' to a index higher than what exist on the current parent ${this.parent.Name} [value: ${index}]`, "Scene Objects"); return null; }

        const thisIndex = this.parent.findChildIndex(this);
        if (thisIndex === index) { return; }
        if( thisIndex === -1) { throw new Error(`[Scene Objects] ${this.Name} does not exist in child list of ${this.parent.Name}`); } 
        else if(thisIndex < index) {
            for(let i = thisIndex; i < index; i++) {
                const tempObject = this.parent.children[i];
                this.parent.children[i] = this.parent.children[i+1];
                this.parent.children[i+1] = tempObject;
            }
        } 
        else
        {
            for(let i = index; i > thisIndex; i--) {
                const tempObject = this.parent.children[i];
                this.parent.children[i] = this.parent.children[i-1];
                this.parent.children[i-1] = tempObject;
            }
        }

    }
}

type SceneObjectComponent = InstanceType<typeof SceneObject.Component>
export default SceneObject;

