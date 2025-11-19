/**
 * @file Texture.ts
 */

import { GLContext } from "../../GL/GLContext.js";
import { ShaderProgram } from "../../GL/ShaderProgram.js";

/**
 * @class BaseTexture
 * 
 * @brief Abstract base class for textures
 */
export abstract class BaseTexture {

    /**
     * @brief Applies the texture to the shader program
     * 
     * @param program The shader program
     */
    abstract apply(program: ShaderProgram): void;

    /**
     * @brief Packs the texture data into WebGL buffers
     * 
     * @param context The GL context
     */
    abstract pack(context: GLContext): void;

    /**
     * @brief Returns the packed texture data for binding
     * 
     * @returns Array of attribute name and buffer pairs
     */
    abstract packedData(): [string, WebGLBuffer][];

    /**
     * @brief Destroys the packed texture data
     */
    abstract destroy(): void;

    /**
     * @brief Gets the alpha value of the texture
     */
    abstract get alpha(): number;

    /**
     * @brief Sets the alpha value of the texture
     */
    abstract set alpha(val: number);
};
