/**
 * @file Light.ts
 *
 * @brief Light properties for scene use
 */
import { Vector3 } from "../MatrixMath/Vector.js";
import { GLColor } from "../Prefabs/Textures/Color.js";
export class GLLight {
    constructor(position, color) {
        this.position = new Vector3();
        this._color = GLColor.White.rgb;
        if (position)
            this.position = position;
        if (color)
            this._color = color.rgb;
    }
    setColor(color) {
        this._color = color.rgb;
    }
    get color() { return this._color; }
    ;
}
