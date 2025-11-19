/**
 * @file SolidColorTexture.ts
 * 
 * @brief A texture that applies a single solid color to a shape.
 */

import { BaseTexture } from "./Texture.js";
import { GLColor } from "./Color.js";
import { ShaderProgram } from "../../GL/ShaderProgram.js";
import { GLContext } from "../../GL/GLContext.js";

/**
 * @class SolidColorTexture
 * 
 * @brief A uniform color texture
 */
export class SolidColorTexture extends BaseTexture {

    private readonly _color: GLColor;
    private readonly _specularity: number;
    private _alpha: number = 1.0;

    /**
     * @brief Creates a new SolidColorTexture
     * 
     * @param color The color to apply
     * @param specularity Specular highlight intensity
     */
    constructor(color: GLColor, specularity: number = 32.0) {
        super();
        this._color = color;
        this._specularity = specularity;
    }

    get alpha() { return this._alpha; }
    set alpha(val: number) { this._alpha = val; }

    /**
     * @brief Applies the texture uniforms to the shader program
     * 
     * @param program The shader program to apply to
     */
    apply(program: ShaderProgram) {
        program.setUniformBool("useTexture", false);
        program.setUniformBool("useVertexColor", false);
        program.setUniformVec4("objectColor", this._color);
        program.setUniformFloat("shininess", this._specularity);
        program.setUniformFloat("globalAlpha", this._alpha);
    }

    /**
     * @brief Packs the texture data (no-op for solid color)
     * 
     * @param _ The GL context
     */
    pack(_: GLContext): void {
        return;
    }

    /**
     * @brief Returns the packed texture data (empty for solid color)
     * 
     * @returns Empty array
     */
    packedData(): [string, WebGLBuffer][] {
        return [];
    }

    /**
     * @brief Destroys the packed texture data (no-op)
     */
    destroy(): void {
        return;
    }
};
