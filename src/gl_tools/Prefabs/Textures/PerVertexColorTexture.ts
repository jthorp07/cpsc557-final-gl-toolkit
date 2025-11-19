/**
 * @file PerVertexColorTexture.ts
 * 
 * @brief A texture that applies a color to each vertex of a shape
 */

import { GLContext } from "../../GL/GLContext.js";
import { ShaderProgram } from "../../GL/ShaderProgram.js";
import { PackedGLBuffer } from "../../GL/types.js";
import { GLColor } from "./Color.js";
import { BaseTexture } from "./Texture.js";

/**
 * @class PerVertexColorTexture
 * 
 * @brief A texture that maps colors to vertices
 */
export class PerVertexColorTexture extends BaseTexture {

    private readonly _colors: GLColor[];
    private readonly _specularity: number;
    private _packedColors: PackedGLBuffer | undefined;
    private _alpha: number = 1.0;

    /**
     * @brief Creates a new PerVertexColorTexture
     * 
     * @param colors Array of colors corresponding to vertices
     * @param specularity Specular highlight intensity
     */
    constructor(colors: GLColor[], specularity: number) {
        super();
        this._colors = colors;
        this._specularity = specularity;
    }

    get alpha() { return this._alpha; }
    set alpha(val: number) { this._alpha = val; }

    /**
     * @brief Applies the texture uniforms to the shader program
     * 
     * @param program The shader program to apply to
     */
    apply(program: ShaderProgram): void {
        program.setUniformBool("useVertexColor", true);
        program.setUniformBool("useTexture", false);
        program.setUniformFloat("shininess", this._specularity);
        program.setUniformFloat("globalAlpha", this._alpha);
    }

    /**
     * @brief Packs the texture data into WebGL buffers
     * 
     * @param context The GL context
     */
    pack(context: GLContext): void {
        if (this._packedColors) {
            this._packedColors.destroy();
            this._packedColors = undefined;
        }
        this._packedColors = context.packData(this._colors);
    }

    /**
     * @brief Returns the packed texture data for binding
     * 
     * @returns Array of attribute name and buffer pairs
     */
    packedData(): [string, WebGLBuffer][] {
        if (!this._packedColors) throw new Error("This texture has not been packed, or has been invalidated since its last packing");
        return [["vertexColor", this._packedColors.buffer]];
    }

    /**
     * @brief Destroys the packed texture data
     */
    destroy(): void {
        if (this._packedColors) this._packedColors.destroy();
        this._packedColors = undefined;
    }
};
