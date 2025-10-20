interface KEY_ACTION {
    name: string,
    doAction(key:Key):void;
}

class Key {

    private _code:string;
    private _isPressed:boolean;
    private OnKeyUp: KEY_ACTION[] = [];
    private OnKeyDown: KEY_ACTION[] = [];

    constructor(code:string, isPressed:boolean = false) {
        this._code = code;
        document.addEventListener("keydown", this.keyPressed.bind(this));
        document.addEventListener("keyup", this.keyReleased.bind(this));
        this._isPressed = isPressed;
    }

    private keyPressed(event:KeyboardEvent):void {
        const code:string = event.code;
        if(!this._isPressed) {
            if(this.code === code) {
                this._isPressed = true;
                this.OnKeyDown.forEach( (action:KEY_ACTION):void => {
                        action.doAction(this);
                    }
                );
            }
        }
    }

    private keyReleased(event:KeyboardEvent):void {
        const code:string = event.code;
        if(this._isPressed) {
            if (this.code === code) {
                this._isPressed = false;
                this.OnKeyUp.forEach((action: KEY_ACTION): void => {
                        action.doAction(this);
                    }
                );
            }
        }
    }

    /*
     * adds a listener for when the key is pressed
     * returns: whether the listener was successfully added as true otherwise false
    */
    public addKeyDownListener(action:KEY_ACTION):boolean {
        const exists:boolean = this.OnKeyDown.every( (exAction:KEY_ACTION) => { exAction.name !== action.name; } );
        if (!exists) {
            return false;
        }
        this.OnKeyDown.push(action);
        return true;
    }

    /*
     * removes a listener for when the key is pressed
     * returns: whether the listener was successfully removed as true otherwise false
    */
    public removeKeyDownListener(name:string):boolean {
        let isDeleted:boolean = false;
        this.OnKeyDown = this.OnKeyDown.filter((data:KEY_ACTION) => {
           if(!isDeleted){
               if(data.name !== name) {
                   isDeleted = true;
                   return false;
               }
               else {
                   return true;
               }
           } else {
               return true;
           }
        })
        return isDeleted;
    }

    /*
     * adds a listener for when the key is released
     * returns: whether the listener was successfully added as true otherwise false
    */
    public addKeyUpListener(action:KEY_ACTION):boolean {
        const exists:boolean = this.OnKeyUp.every( (exAction:KEY_ACTION) => { exAction.name !== action.name; } );
        if (!exists) {
            return false;
        }
        this.OnKeyUp.push(action);
        return true;
    }

    /*
     * removes a listener for when the key is released
     * returns: whether the listener was successfully removed as true otherwise false
    */
    public removeKeyUpListener(name:string):boolean {
        let isDeleted:boolean = false;
        this.OnKeyUp = this.OnKeyUp.filter((data:KEY_ACTION) => {
            if(!isDeleted){
                if(data.name !== name) {
                    isDeleted = true;
                    return false;
                }
                else {
                    return true;
                }
            } else {
                return true;
            }
        })
        return isDeleted;
    }

    public get code (): string {
        return this._code;
    }

    /*
     * whether the key is currently being pressed or not
    */
    public get isPressing (): boolean {
        return this._isPressed;
    }

    /*
     * whether the key is down or not
    */
    public get isKeyDown (): boolean {
        return this._isPressed;
    }

    /*
     * whether the key is up or not
    */
    public get isKeyUp (): boolean {
        return !this._isPressed;
    }
}

export default Key;