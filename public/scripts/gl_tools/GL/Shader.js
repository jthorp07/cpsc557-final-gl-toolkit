/**
 * @file Shader.ts
 *
 * @brief Shader data classes that contains the shader's instructions
 *        and in/out parameter data for frontend interaction.
 */
export class Shader {
    constructor(text) {
        this.text = text;
    }
    toURL() {
        const blob = new Blob([this.text], { type: "text/plain" });
        return URL.createObjectURL(blob);
    }
}
;
export class VertexShader extends Shader {
    constructor(text, uniforms, attributes, varyings) {
        super(text);
        this.uniforms = uniforms;
        this.attributes = attributes;
        this.varyings = varyings;
    }
    isVertexShader() { return true; }
    ;
    isFragmentShader() { return false; }
    ;
}
;
export class FragmentShader extends Shader {
    constructor(text, uniforms) {
        super(text);
        this.uniforms = uniforms;
    }
    isVertexShader() { return false; }
    ;
    isFragmentShader() { return true; }
    ;
}
