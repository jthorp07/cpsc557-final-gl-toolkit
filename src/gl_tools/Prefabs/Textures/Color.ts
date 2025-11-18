/**
 * @file Color.ts
 * 
 * @brief A color class
 */

import { Vector3, Vector4 } from "../../MatrixMath/Vector.js";

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

/**
 * @brief A specialization of Vector4 with additional properties and methods
 *        to aid with handling colors in WebGL
 */
export class GLColor extends Vector4 {

    // Static accessors for common colors
    static get Red() { return new GLColor(1.0, 0.0, 0.0, 1.0); };
    static get Green() { return new GLColor(0.0, 1.0, 0.0, 1.0) };
    static get Blue() { return new GLColor(0.0, 0.0, 1.0, 1.0); };
    static get White() { return new GLColor(1.0, 1.0, 1.0, 1.0); }
    static get Black() { return new GLColor(0.0, 0.0, 0.0, 1.0); };
    static get Yellow() { return new GLColor(1.0, 1.0, 0.0, 1.0); };
    static get Cyan() { return new GLColor(0.0, 1.0, 1.0, 1.0); };
    static get Magenta() { return new GLColor(1.0, 0.0, 1.0, 1.0); };

    // Property accessors and mutators
    get red(): number { return this[0] };
    set red(val: number) { this[0] = val; };
    get green(): number { return this[1] };
    set green(val: number) { this[1] = val; };
    get blue(): number { return this[2]; };
    set blue(val: number) { this[2] = val; };
    get alpha(): number { return this[3]; };
    set alpha(val: number) { this[3] = val; };
    get rgb() { return new Vector3(this.red, this.green, this.blue); };

    /**
     * @brief Sets this color using a hexadecimal string representing RBGA values
     * 
     * @param hexcode Target hex code
     */
    setHexCode(hexcode: string) {
        if (hexcode.length !== 8) throw new Error("Color hex strings must be of length 8");

    }

    /**
     * @brief Sets this color to the corresponding RBGA value using 0-255 for each channel
     * 
     * @param red Red channel value
     * @param green Green channel value
     * @param blue Blue channel value
     * @param alpha Alpha channel value
     */
    setRGBA(red: number, green: number, blue: number, alpha: number) {
        this[0] = red / 255;
        this[1] = green / 255;
        this[2] = blue / 255;
        this[3] = alpha / 255;
    }

    /**
     * @brief Ensures all values are in the range [0.0, 1.0]
     */
    clamp() {
        this[0] = clamp(this[0], 0.0, 1.0);
        this[1] = clamp(this[1], 0.0, 1.0);
        this[2] = clamp(this[2], 0.0, 1.0);
        this[3] = clamp(this[3], 0.0, 1.0);
    }
}