/**
 * @file Input.ts
 * 
 * @brief Controls and exposes user inputs
 */

export class Input {

    private static _instance: Input;
    private _canvas: HTMLCanvasElement;

    // Mouse Move Trackers
    private _dX: number = 0;
    private _dY: number = 0;
    // WASD Pressed
    private _wPressed = false;
    private _aPressed = false;
    private _sPressed = false;
    private _dPressed = false;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.initializeMouseMove();
        this.initializeWASD();
    }

    // Event accessors

    static get MouseMove() { 
        const movement = { dX: this._instance._dX, dY: this._instance._dY };
        this._instance._dX = 0;
        this._instance._dY = 0;
        return movement;
    }
    static get WPressed() { return this._instance._wPressed; }
    static get APressed() { return this._instance._aPressed; }
    static get SPressed() { return this._instance._sPressed; }
    static get DPressed() { return this._instance._dPressed; }

    /**
     * @brief Static initializer for the singleton instance of this class
     * 
     * @param canvas Target canvas
     */
    static initialize(canvas: HTMLCanvasElement) {
        this._instance = new Input(canvas);
    }

    /**
     * @brief Binds the singleton instance to a new canvas for controls that should only
     *        be enabled while the canvas is focused
     * 
     * @param canvas Target canvas
     */
    static rebind(canvas: HTMLCanvasElement) {
        this._instance._canvas = canvas;
    }

    private initializeMouseMove() {

        this._canvas.addEventListener("click", () => {
            this._canvas.requestPointerLock();
        });

        document.addEventListener("mousemove", (event) => {
            if (document.pointerLockElement === this._canvas) {
                this._dX += event.movementX;
                this._dY += event.movementY;
            }
        });
    }

    private initializeWASD() {

        document.addEventListener("keydown", (event) => {
            switch (event.key.toLowerCase()) {
                case "w":
                    this._wPressed = true; 
                    break;
                case "s":
                    this._sPressed = true; 
                    break;
                case "a":
                    this._aPressed = true; 
                    break;
                case "d":
                    this._dPressed = true;  
                    break;
            }
        });
        document.addEventListener("keyup", (event) => {
            switch (event.key.toLowerCase()) {
                case "w":
                    this._wPressed = false; 
                    break;
                case "s":
                    this._sPressed = false; 
                    break;
                case "a":
                    this._aPressed = false; 
                    break;
                case "d":
                    this._dPressed = false;  
                    break;
            }
        });
    }
}
