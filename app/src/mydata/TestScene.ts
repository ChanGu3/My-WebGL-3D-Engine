import Vec3 from "../engine/linear-algebra/Vec3";
import Mesh from "../engine/rendering/Mesh";
import ShaderProgram from "../engine/rendering/shaders/ShaderProgram";
import Texture from "../engine/rendering/Texture";
import Renderer3D from "../engine/Scene/Components/Renderer3D";
import SceneGraph from "../engine/Scene/SceneGraph";
import SceneObject from "../engine/Scene/SceneObject";
import DirectionalLight from '../engine/Scene/Components/Lights/DirectionalLight'
import Vec4 from "../engine/linear-algebra/Vec4";
import PointLight from "../engine/Scene/Components/Lights/PointLight";

class TestScene extends SceneGraph {

    constructor() {
        super();

        const shaderD = ShaderProgram.ShaderPrograms['default']
        const shaderC = ShaderProgram.ShaderPrograms['coordinates']

        const meshC = Mesh.Meshes['cubeC'];
        const meshCD = Mesh.Meshes['cubeD'];
        const meshD = Mesh.Meshes['sphere'];

        
        const cube0 = new SceneObject("cube0");
        cube0.Transform.position = Vec3.create(-0.1,0,0.5);
        cube0.Transform.scale = Vec3.create(0.1,0.1,0.1);
        cube0.Transform.rotation = Vec3.create(0, 0, 0);
        cube0.addComponent(Renderer3D);
        const cube0_3DRenderer = cube0.getComponent(Renderer3D) as Renderer3D;
        cube0_3DRenderer.Mesh = meshC;
        cube0_3DRenderer.ShaderProgram = shaderC;


        const cube2 = new SceneObject("cube2");
        cube2.Transform.scale = Vec3.create(0.1, 0.1, 0.1);
        cube2.Transform.position = Vec3.create(0,0.15,0.25);
        cube2.addComponent(Renderer3D);
        const cube2_3DRenderer = cube2.getComponent(Renderer3D) as Renderer3D;
        cube2_3DRenderer.Mesh = meshCD;
        cube2_3DRenderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0,1,0,0.1));
        cube2_3DRenderer.ShaderProgram = shaderD;

        
        const cube3 = new SceneObject("cube3");
        cube3.Transform.scale = Vec3.create(0.1, 0.1, 0.1);
        cube3.Transform.position = Vec3.create(0,0.15,0.5);
        cube3.addComponent(Renderer3D);
        const cube3_3DRenderer = cube3.getComponent(Renderer3D) as Renderer3D;
        cube3_3DRenderer.Mesh = meshCD;
        cube3_3DRenderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(0,0,1,0.1));
        cube3_3DRenderer.ShaderProgram = shaderD;
        

        const cube1 = new SceneObject("sphere");
        cube1.Transform.position = Vec3.create(0,0,0.5);
        cube1.Transform.scale = Vec3.create(0.1,0.1,0.1);
        cube1.addComponent(Renderer3D);
        const cube1_3DRenderer = cube1.getComponent(Renderer3D) as Renderer3D;
        cube1_3DRenderer.Mesh = meshD;
        cube1_3DRenderer.Material.Texture = Texture.Textures['metal_scale'];
        cube1_3DRenderer.ShaderProgram = shaderD;


        const sphere1 = new SceneObject("sphere");
        sphere1.Transform.position = Vec3.create(0,0,0.25);
        sphere1.Transform.scale = Vec3.create(0.1,0.1,0.1);
        sphere1.addComponent(Renderer3D);
        const sphere1_3DRenderer = sphere1.getComponent(Renderer3D) as Renderer3D;
        sphere1_3DRenderer.Mesh = meshD;
        sphere1_3DRenderer.Material.Ambient = 1;
        sphere1_3DRenderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(1,1,1,0.1));
        sphere1_3DRenderer.ShaderProgram = shaderD;


        /*
        const light1 = new SceneObject("DirectionalLight");
        light1.Transform.rotation = Vec3.create((45/360), 0, 0);
        light1.addComponent(DirectionalLight);
*/
        const light2 = new SceneObject("PointLight");
        light2.Transform.position = Vec3.create(0,0,0);
        light2.Transform.scale = Vec3.create(0.5,0.5,0.5);
        light2.addComponent(Renderer3D);
        const light2_3DRenderer = light2.getComponent(Renderer3D) as Renderer3D;
        light2_3DRenderer.Mesh = meshD;
        light2_3DRenderer.Material.Ambient = 1;
        light2_3DRenderer.Material.Texture = Texture.COLOR_TEXTURE_DATA(Vec4.create(1,1,1,1));
        light2_3DRenderer.ShaderProgram = shaderD;
        light2.addComponent(PointLight);

        light2.setParent(sphere1);
    }
}

export default TestScene;