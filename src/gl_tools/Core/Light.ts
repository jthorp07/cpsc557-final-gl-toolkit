/**
 * @file Light.ts
 * 
 * @brief Light properties for scene use
 */

import { Vector3 } from "../MatrixMath/Vector.js";
import { GLColor } from "../Prefabs/Textures/Color.js";

export class GLLight {

    position: Vector3 = new Vector3();
    private _color: Vector3 = GLColor.White.rgb;

    constructor(position?: Vector3, color?: GLColor) {
        if (position) this.position = position;
        if (color) this._color = color.rgb;
    }

    setColor(color: GLColor) {
        this._color = color.rgb;
    }

    get color() { return this._color; };
}
