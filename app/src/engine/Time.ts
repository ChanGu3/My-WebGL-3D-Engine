class Time {
    public static OnDeltaUpdate:Event = new Event("Update");
    public static OnFixedUpdate:Event = new Event("FixedUpdate");

    private static readonly TICK_RATE: number = 60;
    private static readonly MILI_SEC_PER_TICK: number = 1000 / this.TICK_RATE;
    private static readonly FIXED_TIME = Time.MILI_SEC_PER_TICK / 1000;

    private static lastFrameUpTime: number = 0.0;
    private static deltaTime: number =  0.0;

    static {
        document.addEventListener("StartNewFrameEvent", Time.deltaUpdate); // must send "on event" to this event per frame somewhere else
        setInterval(Time.fixedUpdate.bind(Time), Time.MILI_SEC_PER_TICK);
    }

    private static deltaUpdate():void {
        if(Time.lastFrameUpTime !== 0.0) { Time.deltaTime = Time.MiliToSec(window.performance.now() - Time.lastFrameUpTime); }
        Time.lastFrameUpTime = window.performance.now();
        document.dispatchEvent(Time.OnDeltaUpdate);
    }

    private static fixedUpdate():void {
        document.dispatchEvent(Time.OnFixedUpdate);
    }

    // Convert Milliseconds into Seconds
    private static MiliToSec(milliseconds:number):number {
        return milliseconds/1000;
    }

    public static get DeltaTime():number {
        return Time.deltaTime
    }

    public static get TimeElapsed():number {
        return window.performance.now();
    }

    public static get FixedTime():number {
        return Time.FIXED_TIME;
    }
}

export default Time;