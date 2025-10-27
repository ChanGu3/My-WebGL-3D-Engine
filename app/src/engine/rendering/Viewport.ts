import Engine3D from "../Engine3D";

class Viewport {
    private canvas: HTMLCanvasElement;

    private _width: number = 0;
    private _prevWidth: number = 0;
    private _height: number = 0;
    private _prevHeight: number = 0;

    private isFullScreen: boolean = false;

    constructor(canvas:HTMLCanvasElement, width: number = 640, height: number = 360) {
        canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
            canvas.requestFullscreen();
        });

        document.addEventListener("fullscreenchange", (e) => {
            if(!this.isFullScreen) {
                this.isFullScreen = true;
                this.SetResolution(window.screen.availWidth, window.screen.availHeight);
            } else {
                this.isFullScreen = false;
                this.SetResolution(this._prevWidth, this._prevHeight);
            }
        });

        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
        });

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
        this._prevWidth = this._width;
        this._prevHeight = this._height;

        this.canvas.width = width;
        this.canvas.height = height;
        this._width = width;
        this._height = height;
        Engine3D.inst.GL.viewport(0,0,width,height);
    }
}

export default Viewport;