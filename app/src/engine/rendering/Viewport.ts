import Engine3D from "../Engine3D";

class Viewport {

    private canvas: HTMLCanvasElement;

    private _width: number;
    private _height: number;

    constructor(canvas:HTMLCanvasElement, width: number = 640, height: number = 360) {
        this.canvas = canvas;
        this._width = width;
        this._height = height;
        this.SetResolution(this._width, this._height);
    }

    public get width():number {
        return this._width;    }

    public get height():number {
        return this._height;
    }

    public get aspectRatio():number {
        return this._width / this._height;
    }

    public SetResolution(width:number, height:number):void {
        this.canvas.width = width;
        this.canvas.height = height;
        Engine3D.inst.GL.viewport(0,0,width,height);
    }
}

export default Viewport;