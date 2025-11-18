/**
 * @file VertexShaderBuilder.ts
 *
 * @brief Builder class for GLSL vertex shaders
 */
import { FragmentShader } from "../../Shader.js";
import { VaryingGenerator } from "../generators/VaryingGenerator.js";
import { ShaderBuilder, ShaderMainMethodBuilder } from "./ShaderBuilder.js";
const GL_FRAGCOLOR = "gl_FragColor";
const OUT_FRAGCOLOR = "fragColor";
export class FragmentShaderMainBuilder extends ShaderMainMethodBuilder {
    constructor(globalVariables, version) {
        super(globalVariables);
        this.fragColorOut = version === 1 ? GL_FRAGCOLOR : OUT_FRAGCOLOR;
        this.validIdentifiers.set(this.fragColorOut, "vec4");
    }
    assignGLFragColor(assignment) {
        this.assignVariable(this.fragColorOut, assignment);
        return this;
    }
}
;
export class FragmentShaderBuilder extends ShaderBuilder {
    constructor(version) {
        super();
        this.varyings = [];
        this.version = version;
    }
    addVarying(name, type) {
        this.varyings.push({ direction: "in", type: type, name: name });
        return this;
    }
    setMain(builder) {
        this.mainMethod = builder;
        return this;
    }
    buildGlobalDeclarations(baseGlobalDeclarations) {
        const varyingDeclarations = this.varyings.map(varying => {
            return VaryingGenerator.generateVarying(varying, this.version);
        }).join("\n");
        return [baseGlobalDeclarations, varyingDeclarations].join("\n");
    }
    assembleShader(shaderText) {
        return new FragmentShader(shaderText, this.uniforms);
    }
}
;
