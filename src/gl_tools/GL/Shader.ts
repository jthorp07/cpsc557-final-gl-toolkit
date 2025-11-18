/**
 * @file Shader.ts
 * 
 * @brief Shader data classes that contains the shader's instructions
 *        and in/out parameter data for frontend interaction.
 */

import { ShaderAttribute, ShaderUniform, ShaderVarying } from "./types";

export abstract class Shader {

    readonly text: string;
    
    constructor(text: string) {
        this.text = text;
    }

    toURL() {
        const blob = new Blob([this.text], { type: "text/plain" });
        return URL.createObjectURL(blob);
    }

    abstract isVertexShader(): this is VertexShader;
    abstract isFragmentShader(): this is FragmentShader;
};

export class VertexShader extends Shader {

    readonly uniforms: ShaderUniform[];
    readonly attributes: ShaderAttribute[];
    readonly varyings: ShaderVarying[];

    constructor(text: string, uniforms: ShaderUniform[], attributes: ShaderAttribute[], varyings: ShaderVarying[]) {
        super(text);
        this.uniforms = uniforms;
        this.attributes = attributes;
        this.varyings = varyings;
    }

    isVertexShader(): this is VertexShader { return true; };
    isFragmentShader(): this is FragmentShader { return false; };
};

export class FragmentShader extends Shader {

    readonly uniforms: ShaderUniform[];

    constructor(text: string, uniforms: ShaderUniform[]) {
        super(text);
        this.uniforms = uniforms;
    }

    isVertexShader(): this is VertexShader { return false; };
    isFragmentShader(): this is FragmentShader { return true; };
}
