import Key from "./Key";

type KEYS = {[code: string] : Key}

class Keyboard {
    private static _inst:Keyboard;

    private static keys: KEYS = {};

    constructor() {
        if(Keyboard._inst === null) {
            new Error("Can only have one instance of Keyboard");
        }
        Keyboard._inst = this;

        document.addEventListener("keydown", Keyboard.addKeyOnPress);
    }

    /*
     * when a key is pressed, and it does not exist, adds it to the available keys
    */
    private static addKeyOnPress(event:KeyboardEvent):void {
        const code:string = event.code;
        console.log(code);
        if(!Keyboard.keys[code]) {
            Keyboard.keys[code] = new Key(code,true);
        }
    }

    /*
     * gets a key by its code name from KeyboardEvent; (adds a key that has not been added if it does not exist)
    */
    public static getKey(code:string):Key {
        if(!Keyboard.keys[code]) {
            Keyboard.keys[code] = new Key(code);
        }
        return Keyboard.keys[code];
    }
}

export default Keyboard;