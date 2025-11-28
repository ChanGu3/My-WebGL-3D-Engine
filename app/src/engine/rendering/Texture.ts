import Engine3D from "../Engine3D";
import Vec3 from "../linear-algebra/Vec3";
import Vec4 from "../linear-algebra/Vec4";

type TEXTURES = {
    [name:string]: Texture;
};

class Texture {
    private static readonly bytes_per_pixel: number = 4; //RGBA
    private static textures: TEXTURES = {};

    private texture: WebGLTexture|null = null;
    private isFullyOpaque: boolean = true;

    public static XOR_TEXTURE_DATA(width:number):Texture {

        const data = new Uint8Array(width * width * Texture.bytes_per_pixel);
        for( let row:number = 0; row < width; row++ ) {
            for( let col:number = 0; col < width; col++ ) {
                let pixLoc:number = ( row * width + col ) * 4;
                data[pixLoc] = data[pixLoc + 1] = data[pixLoc + 2] = row ^ col;
                data[pixLoc + 3] = 255;
            }
        }

        return Texture.CreateTexture(data, width, width);
    }

    public static COLOR_TEXTURE_DATA(color: Vec4, width:number = 4 ):Texture {
        const data = new Uint8Array(width * width * Texture.bytes_per_pixel);

        for( let row:number = 0; row < width; row++ ) {
            for( let col:number = 0; col < width; col++ ) {
                let pixLoc:number = ( row * width + col ) * 4;
                data[pixLoc] = color.X * 255
                data[pixLoc + 1] = color.Y * 255;
                data[pixLoc + 2] = color.Z * 255;
                data[pixLoc + 3] = color.W * 255;
            }
        }

        return Texture.CreateTexture(data, width, width);
    }

    private static CreateTexture(data:Uint8Array, width:number, height:number):Texture {
        const textNew:Texture = new Texture();
        textNew.texture = Engine3D.inst.GL.createTexture();

        // checks for any transparency
        textNew.isFullyOpaque = true;
        for(let i = 0; i < data.length && textNew.isFullyOpaque; i++) {
            if(i % 4 === 3) { textNew.isFullyOpaque = (data[i] === 255); }
        }

        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, textNew.texture );
        Engine3D.inst.GL.texImage2D(
            WebGL2RenderingContext.TEXTURE_2D, 0,  WebGL2RenderingContext.RGBA,
            width, height, 0,
            WebGL2RenderingContext.RGBA,  WebGL2RenderingContext.UNSIGNED_BYTE,
            data,
        );

        Engine3D.inst.GL.generateMipmap( WebGL2RenderingContext.TEXTURE_2D );

        Engine3D.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR);
        Engine3D.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);

        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null );
        return textNew;
    }

    private static CreateImageBitMapTexture(imageBitMap:ImageBitmap ):Texture {
        const textNew:Texture = new Texture();
        textNew.texture = Engine3D.inst.GL.createTexture();

        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, textNew.texture );
        Engine3D.inst.GL.texImage2D(
            WebGL2RenderingContext.TEXTURE_2D, 0,  WebGL2RenderingContext.RGBA,
            WebGL2RenderingContext.RGBA,  WebGL2RenderingContext.UNSIGNED_BYTE,
            imageBitMap,
        );

        Engine3D.inst.GL.generateMipmap( WebGL2RenderingContext.TEXTURE_2D );

        Engine3D.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR);
        Engine3D.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);

        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null );
        return textNew;
    }

    // @ts-ignore
    public static async LoadTextures(): Promise<void> {
        Texture.textures['xor'] = Texture.XOR_TEXTURE_DATA(256);
        Texture.textures['green'] = Texture.COLOR_TEXTURE_DATA(Vec4.create(0,1,0,1))
        Texture.textures['texture_map'] = await Texture.AddToTextures('texture_map.png');
        Texture.textures['test'] = await Texture.AddToTextures('test.gif');
        Texture.textures['test2'] = await Texture.AddToTextures('test2.jpg');
        Texture.textures['metal_scale'] = await Texture.AddToTextures('metal_scale.png');
        Texture.textures['bell'] = await Texture.AddToTextures('bell.png');
    }

    // @ts-ignore
    public static async AddToTextures(fileName:string): Promise<Texture> {
        const resp:Response = await fetch(`/tex/${fileName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'image/*'
            }
        });

        const imageBlob:Blob = await resp.blob();
        const imageBitMap:ImageBitmap = await createImageBitmap( imageBlob );

        return this.CreateImageBitMapTexture(imageBitMap);
    }

    public static get Textures(): TEXTURES {
        return this.textures;
    }

    public bind():void {
        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.texture );
        (!this.isFullyOpaque) ? Engine3D.inst.GL.depthMask(false) : null;
    }

    public unbind():void {
        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null );
        (!this.isFullyOpaque) ? Engine3D.inst.GL.depthMask(true) : null;
    }
}

export default Texture;