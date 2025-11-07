import Texture from "./Texture"
import Engine3D from "../Engine3D";



class Material {

    private texture: Texture = Texture.Textures['xor'];
    private ambient: number = 0.25;
    private diffuse: number = 1;
    private specular: number = 2;
    private shininess: number = 4;

    public get Ambient(): number {
        return this.ambient;
    }

    public get Diffuse(): number {
        return this.diffuse;
    }

    public get Specular(): number {
        return this.specular;
    }

    public get Shininess(): number {
        return this.shininess;
    }

    public set Texture(texture: Texture) {
        this.texture = texture;
    }

    public get Texture() {
        return this.texture;
    }

    /*
     * binds the material data to buffer and uniforms
    */
    public bind() {
        this.texture.bind();

    }

    /*
     * unbinds the material data to buffer and uniforms
    */
    public unbind() {
        Texture.unbind();
    }
}

export default Material;