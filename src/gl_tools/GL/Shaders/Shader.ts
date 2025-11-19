/**
 * @file Shader.ts
 * 
 * @brief Shader data classes that contains the shader's instructions
 *        and in/out parameter data for frontend interaction
 */

import { ShaderAttribute, ShaderUniform, ShaderVarying } from "../types.js";

/**
 * @class Shader
 * 
 * @brief Abstract base class for shaders
 */
export abstract class Shader {

    readonly text: string;

    /**
     * @brief Creates a new Shader
     * 
     * @param text The shader source code
     */
    constructor(text: string) {
        this.text = text;
    }

    /**
     * @brief Creates a blob URL for the shader source
     * 
     * @returns A URL string pointing to the shader source
     */
    toURL() {
        const blob = new Blob([this.text], { type: "text/plain" });
        return URL.createObjectURL(blob);
    }

    /**
     * @brief Checks if this is a vertex shader
     */
    abstract isVertexShader(): this is VertexShader;
    /**
     * @brief Checks if this is a fragment shader
     */
    abstract isFragmentShader(): this is FragmentShader;
};

/**
 * @class VertexShader
 *
 * @brief A vertex shader
 */
export class VertexShader extends Shader {

    readonly uniforms: ShaderUniform[];
    readonly attributes: ShaderAttribute[];
    readonly varyings: ShaderVarying[];

    /**
     * @brief Creates a new VertexShader
     *
     * @param text The shader source code
     * @param uniforms Array of uniforms used in the shader
     * @param attributes Array of attributes used in the shader
     * @param varyings Array of varyings used in the shader
     */
    constructor(text: string, uniforms: ShaderUniform[], attributes: ShaderAttribute[], varyings: ShaderVarying[]) {
        super(text);
        this.uniforms = uniforms;
        this.attributes = attributes;
        this.varyings = varyings;
    }

    isVertexShader(): this is VertexShader { return true; };
    isFragmentShader(): this is FragmentShader { return false; };
};

/**
 * @class FragmentShader
 * 
 * @brief A fragment shader
 */
export class FragmentShader extends Shader {

    readonly uniforms: ShaderUniform[];

    /**
     * @brief Creates a new FragmentShader
     * 
     * @param text The shader source code
     * @param uniforms Array of uniforms used in the shader
     */
    constructor(text: string, uniforms: ShaderUniform[]) {
        super(text);
        this.uniforms = uniforms;
    }

    isVertexShader(): this is VertexShader { return false; };
    isFragmentShader(): this is FragmentShader { return true; };
}
