class Time {
    constructor() {
        if (Time._inst == null) {
            new Error("Can only have one instance of Time");
        }
        Time._inst = this;
        document.addEventListener("updateTimeEvent", Time.update);
    }
    static update() {
        if (Time.lastFrameUpTime !== 0.0) {
            Time._deltaTime = Time.MiliToSec(window.performance.now() - Time.lastFrameUpTime);
        }
        Time.lastFrameUpTime = window.performance.now();
    }
    // Convert Milliseconds into Seconds
    static MiliToSec(milliseconds) {
        return milliseconds / 1000;
    }
    static get deltaTime() {
        return this._deltaTime;
    }
}
Time.lastFrameUpTime = 0.0;
Time._deltaTime = 0.0; // delta time in seconds
export default Time;
//# sourceMappingURL=Time.js.map