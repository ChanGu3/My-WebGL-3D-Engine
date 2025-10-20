class Time {
    private static _inst:Time;

    public static readonly TICK_RATE: number = 60;
    public static readonly MILI_SEC_PER_TICK: number = 1000 / this.TICK_RATE;

    private static lastFrameUpTime: number = 0.0;
    private static _deltaTime: number = 0.0; // delta time in seconds



    constructor() {
        if(Time._inst == null) {
            new Error("Can only have one instance of Time");
        }

        Time._inst = this;
        document.addEventListener("updateTimeEvent", Time.update);
    }

    private static update():void {
        if(Time.lastFrameUpTime !== 0.0){
            Time._deltaTime = Time.MiliToSec(window.performance.now() - Time.lastFrameUpTime);
        }
        Time.lastFrameUpTime = window.performance.now();
    }

    // Convert Milliseconds into Seconds
    private static MiliToSec(milliseconds:number):number {
        return milliseconds/1000;
    }

    public static get deltaTime():number {
        return this._deltaTime;
    }

    public static get timeElapsed():number {
        return window.performance.now();
    }

    public static get fixedTime():number {
        return Time.MILI_SEC_PER_TICK / 1000;
    }
}

export default Time;