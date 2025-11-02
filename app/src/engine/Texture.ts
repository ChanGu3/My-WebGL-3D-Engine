import Engine3D from "./Engine3D";

type TEXTURES = {
    [name:string]: Texture;
};

class Texture {
    private static readonly bytes_per_pixel: number = 4; //RGBA
    private static textures: TEXTURES = {};

    private texture: WebGLTexture

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

    private static CreateTexture(data:Uint8Array, width:number, height:number):Texture {
        const textNew:Texture = new Texture();
        textNew.texture = Engine3D.inst.GL.createTexture();

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
        Texture.textures['texture_map'] = await Texture.AddToTextures('texture_map.png');
        Texture.textures['test'] = await Texture.AddToTextures('test.gif');
        Texture.textures['test2'] = await Texture.AddToTextures('test2.jpg');
        Texture.textures['metal_scale'] = await Texture.AddToTextures('metal_scale.png');
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

    public bindTexture():void {
        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.texture );
    }

    public static unBindTexture():void {
        Engine3D.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null );
    }
}

export default Texture;