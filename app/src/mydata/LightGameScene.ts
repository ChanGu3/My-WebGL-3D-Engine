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
import Camera from "../engine/Scene/Components/Cameras/Camera";
import GenerateWorld from "./components/GenerateWorld";
import PlayerController from "./components/PlayerController";
import LightOrbPrefab from "./components/LightOrbPrefab";
import CenterArea from "./components/CenterArea";
import GameManager from "./components/GameManager";

class LightGameScene extends SceneGraph {

    constructor() {
        super();

        // THE MOON
        const theMoon = new SceneObject("moon");
        theMoon.Transform.scale = Vec3.create(3,3,3);
        theMoon.Transform.position = Vec3.create(20,40,20);
        const light = theMoon.addComponent(PointLight);
        light.Color = Vec3.create(0.784, 0.839, 1.000);
        light.Light_Coefficient = 0.025;
        const theMoonRenderer = theMoon.addComponent(Renderer3D);
        theMoonRenderer.Mesh = Mesh.Meshes['sphere']
        theMoonRenderer.Material.Texture = Texture.Textures['2k_moon'];

        const worldGenerator = new SceneObject("WorldGenerator");
        const gW =  worldGenerator.addComponent(GenerateWorld);

        const centerArea = new SceneObject("centerArea");
        centerArea.Transform.position = Vec3.create(0,0.5,0);
        const centerAreanC = centerArea.addComponent(CenterArea);
        centerArea.setParent(worldGenerator);

        const player = new SceneObject("Player");
        player.Transform.position = Vec3.create(0,0.75,-2.5);
        this.Camera = player.addComponent(Camera);
        const playercomponent = player.addComponent(PlayerController);
        playercomponent.WorldGenerator = worldGenerator.getComponent(GenerateWorld);


        const gameManagerObject = new SceneObject("GameManager");
        const gameManager = gameManagerObject.addComponent(GameManager);
        gameManager.GenerateWorld = gW;
        gameManager.PlayerController = playercomponent;
        gameManager.CenterArea = centerAreanC;
    }
}

export default LightGameScene;