/**
 * @file VertexShaderBuilder.ts
 *
 * @brief Builder class for GLSL vertex shaders
 */
import { VertexShader } from "../../Shader.js";
import { AttributeGenerator, VaryingGenerator } from "../generators/index.js";
import { ShaderBuilder, ShaderMainMethodBuilder } from "./ShaderBuilder.js";
const GL_POSITION = "gl_Position";
export class VertexShaderMainBuilder extends ShaderMainMethodBuilder {
    constructor(globalVariables) {
        super(globalVariables);
        this.validIdentifiers.set("gl_Position", "vec4");
    }
    assignGLPosition(assignment) {
        this.assignVariable(GL_POSITION, assignment);
        return this;
    }
}
export class VertexShaderBuilder extends ShaderBuilder {
    constructor(glVersion) {
        super();
        this.attributes = [];
        this.varyings = [];
        this.version = glVersion;
    }
    addAttribute(name, type) {
        this.attributes.push({ type: type, name: name });
        return this;
    }
    addVarying(name, type) {
        this.varyings.push({ direction: "out", type: type, name: name });
        return this;
    }
    setMain(builder) {
        this.mainMethod = builder;
        return this;
    }
    buildGlobalDeclarations(baseGlobalDeclarations) {
        const attributeDeclarations = this.attributes.map(attribute => {
            return AttributeGenerator.generateAttribute(attribute, this.version);
        }).join("\n");
        const varyingDeclarations = this.varyings.map(varying => {
            return VaryingGenerator.generateVarying(varying, this.version);
        }).join("\n");
        return [baseGlobalDeclarations, attributeDeclarations, varyingDeclarations].join("\n");
    }
    assembleShader(shaderText) {
        return new VertexShader(shaderText, this.uniforms, this.attributes, this.varyings);
    }
}
