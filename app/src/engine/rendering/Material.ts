import Texture from "./Texture"
import Engine3D from "../Engine3D";


class Material {
    private static GLOBAL_AMBIENT = 0.25;


    public Texture: Texture|null = null;
    public Ambient: number = Material.GLOBAL_AMBIENT;
    public Diffuse: number = 1;
    public Specular: number = 2;
    public Shininess: number = 4;

    public Opaque:number = 1; // 0 - fully transparent | 1 - fully opaque

    /*
     * binds the material data to buffer and uniforms
    */
    public bind() {
        if( this.Texture ) { this.Texture.bind(); }
        (this.Opaque < 1) ? Engine3D.inst.GL.depthMask(false) : null;
    }

    /*
     * unbinds the material data to buffer and uniforms
    */
    public unbind() {
        if( this.Texture ) { this.Texture.unbind(); }
        (this.Opaque < 1) ? Engine3D.inst.GL.depthMask(true) : null;
    }
}

export default Material;