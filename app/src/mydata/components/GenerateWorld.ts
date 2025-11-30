import Debug from "../../engine/Debug";
import Vec2 from "../../engine/linear-algebra/Vec2";
import Vec3 from "../../engine/linear-algebra/Vec3";
import Vec4 from "../../engine/linear-algebra/Vec4";
import Mesh from "../../engine/rendering/Mesh";
import ShaderProgram from "../../engine/rendering/shaders/ShaderProgram";
import Texture from "../../engine/rendering/Texture";
import Renderer3D from "../../engine/Scene/Components/Renderer3D";
import SceneObject from "../../engine/Scene/SceneObject";

class GenerateWorld extends SceneObject.Component {

    private readonly offset = 2;   
    private currentLength: number = 0; 
    public get FULLLENGTH() {
        return (this.currentLength * 2 * this.offset) + (this.offset)
    }

    public IsOutOfBounds(pos: Vec3) : boolean {
        const checker = this.SceneObject.Transform.position.add(Vec3.create(this.FULLLENGTH/2 - this.offset * 2.75,this.FULLLENGTH/2- this.offset * 2.75,this.FULLLENGTH/2- this.offset * 2.75));
        return (Math.abs(pos.X) > Math.abs(checker.X) || Math.abs(pos.Z) > Math.abs(checker.Z));
    }

    public override Start() {
        this.Generate(10);
    }

    private Generate(length: number = 0, startPos: Vec3 = Vec3.create(0,0,0)) {
        if(length < 0) { Debug.LogWarning("Must Be A Length Greater than -1 To Generate Anything"); return; }
        
        this.currentLength = length
        this.GenerateGround(startPos, this.FULLLENGTH);

        const negativeLength = -length;
        let currentLength = length;
        while(negativeLength <= currentLength){
            const currentPos = Vec3.create(startPos.X, startPos.Y, this.offset*currentLength)
            const borderOffset = -this.offset;

            if(length === currentLength) {
                this.GenerateBorder(currentPos.add(Vec3.create(0, 0, borderOffset)), 5);
            }
            else if(negativeLength === currentLength) {
                this.GenerateBorder(currentPos.sub(Vec3.create(0, 0, borderOffset)), 5, Vec3.create(0,0.5,0));
            }

            const treeRemovalOffset = 2;
            const treeCenterRemoval = 2; // 1 is just center 2 is next circle so on
            // offset removal
            if(currentLength < length-treeRemovalOffset && currentLength > negativeLength+treeRemovalOffset)
            {
                // center removal
                if(currentLength <= -treeCenterRemoval || currentLength >= treeCenterRemoval){
                    this.GenerateChunk(currentPos);
                }
            }

            for(let i = 0; i < length; i++) {
                const vecOffset = Vec3.create(this.offset*(i+1), 0, 0);
                const vecSubOffset = currentPos.sub(vecOffset);
                const vecAddOffset = currentPos.add(vecOffset);

                // offset removal
                if(currentLength < length-treeRemovalOffset && currentLength > negativeLength+treeRemovalOffset && length-treeRemovalOffset > (i+1))
                {
                    // center removal
                    if(i >= treeCenterRemoval-1 || (currentLength <= -treeCenterRemoval || currentLength >= treeCenterRemoval)){
                        this.GenerateChunk(vecSubOffset);
                        this.GenerateChunk(vecAddOffset);
                    }
                }

                    
                if(length === currentLength) {
                    this.GenerateBorder(vecSubOffset.add(Vec3.create(0, 0, borderOffset)), 5);
                    this.GenerateBorder(vecAddOffset.add(Vec3.create(0, 0, borderOffset)), 5);
                }
                else if(negativeLength === currentLength) {
                    this.GenerateBorder(vecSubOffset.sub(Vec3.create(0, 0, borderOffset)), 5, Vec3.create(0,0.5,0));
                    this.GenerateBorder(vecAddOffset.sub(Vec3.create(0, 0, borderOffset)), 5, Vec3.create(0,0.5,0));
                }
                else if(length === (i+1)) {
                    this.GenerateBorder(vecSubOffset.sub(Vec3.create(borderOffset, 0, 0)), 5, Vec3.create(0,0.25,0));
                    this.GenerateBorder(vecAddOffset.add(Vec3.create(borderOffset, 0, 0)), 5, Vec3.create(0,-0.25,0));
                }
            }



            currentLength--;
        }
    }

    private GenerateChunk(pos: Vec3) {
        // creates ground
        this.GenerateTree(pos);
    }

    private GenerateGround(pos: Vec3, scale: number) {
        const testGround = new SceneObject(`ground-${pos}`);
        testGround.Transform.position = pos;
        testGround.Transform.scale = Vec3.create(1 * scale, 0.25, 1 * scale);
        const render = testGround.addComponent(Renderer3D)
        render.Mesh = Mesh.Meshes['cubeD']
         render.Material.Specular = 1;
        render.Material.Shininess = 1;
        render.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0.294, 0.180, 0.082,1));
    }

    private GenerateBorder(pos: Vec3, scale: number, rot: Vec3 = Vec3.create(0,0,0)) {
        const borderSphere = new SceneObject(`treeLeafs-${pos}`);
        borderSphere.Transform.position = pos;
        borderSphere.Transform.rotation = rot;
        borderSphere.Transform.scale = Vec3.create(scale, scale, scale);
        const borderSphereRender = borderSphere.addComponent(Renderer3D)
        borderSphereRender.Mesh = Mesh.Meshes['sphere']
        borderSphereRender.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0.133, 0.545, 0.133, 1));

        const borderSphere2 = new SceneObject(`treeLeafs-${pos}`);

        borderSphere2.Transform.position = Vec3.create(0, 0.5, 1);
        borderSphere2.Transform.scale = Vec3.create(1.25, 1.25, 1.25);
        const borderSphere2Render = borderSphere2.addComponent(Renderer3D)
        borderSphere2Render.Mesh = Mesh.Meshes['sphere']
        borderSphere2Render.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0.133, 0.545, 0.133, 1));

        borderSphere2.setParent(borderSphere);
    }

    public TreeHolder: SceneObject|null = null;
    private GenerateTree(pos: Vec3, factor: Vec2 = Vec2.create(0,0)) {
        if(this.TreeHolder === null) {
            this.TreeHolder = new SceneObject("TreeHolder");
        }

        const tree = new SceneObject(`treetrunck-${pos}`);
        tree.Transform.position = pos.add(Vec3.create(0,0.75,0));
        tree.Transform.scale = Vec3.create(0.25, 1.75, 0.25);
        const treeRender = tree.addComponent(Renderer3D)
        treeRender.Mesh = Mesh.Meshes['cubeD']
        treeRender.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0.361, 0.251, 0.200, 1));
        this.TreeHolder.addChild(tree);    


        const treeLeafs = new SceneObject(`treeLeafs-${pos}`);
        treeLeafs.Transform.position = Vec3.create(0,0.75,0);
        treeLeafs.Transform.scale = Vec3.create(1.75 * 3.5, 0.25 * 3.5, 1.75 * 3.5);
        const treeLeafsRender = treeLeafs.addComponent(Renderer3D)
        treeLeafsRender.Mesh = Mesh.Meshes['sphere']
        treeLeafsRender.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0.000, 0.392, 0.000, 1));

        treeLeafs.setParent(tree);
    }
}

export default GenerateWorld;