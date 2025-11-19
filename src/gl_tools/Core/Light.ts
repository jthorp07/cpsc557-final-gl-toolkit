/**
 * @file Light.ts
 * 
 * @brief Light properties for scene use
 */

import { Vector3 } from "../MatrixMath/Vector.js";
import { GLColor } from "../Prefabs/Textures/Color.js";

/**
 * @class GLLight
 * 
 * @brief Represents a light source in the scene
 */
export class GLLight {

    position: Vector3 = new Vector3();
    private _color: Vector3 = GLColor.White.rgb;

    /**
     * @brief Creates a new GLLight instance
     * 
     * @param position Position of the light
     * @param color Color of the light
     */
    constructor(position?: Vector3, color?: GLColor) {
        if (position) this.position = position;
        if (color) this._color = color.rgb;
    }

    /**
     * @brief Sets the color of the light
     * 
     * @param color New color
     */
    setColor(color: GLColor) {
        this._color = color.rgb;
    }

    /**
     * @brief Gets the color of the light
     * 
     * @returns The light color as a Vector3 (RGB)
     */
    get color() { return this._color; };
}
