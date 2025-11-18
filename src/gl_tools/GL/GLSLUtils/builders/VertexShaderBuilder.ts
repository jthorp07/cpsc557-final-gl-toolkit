/**
 * @file VertexShaderBuilder.ts
 * 
 * @brief Builder class for GLSL vertex shaders
 */

import { assertNotUndefined } from "../../../Core/Assert.js";
import { Shader, VertexShader } from "../../Shader.js";
import { GLVersion, ShaderAttribute, ShaderVarying } from "../../types.js";
import { AttributeGenerator, VaryingGenerator } from "../generators/index.js";
import { BaseExpression, VariableExpression } from "../language/GLSLGrammar.js";
import { GLSLType } from "../language/GLSLTypes.js";
import { ShaderBuilder, ShaderMainMethodBuilder } from "./ShaderBuilder.js";

const GL_POSITION = "gl_Position" as const;

export class VertexShaderMainBuilder extends ShaderMainMethodBuilder {

    constructor(globalVariables: VariableExpression[]) {
        super(globalVariables);
        this.validIdentifiers.set("gl_Position", "vec4")
    }

    assignGLPosition(assignment: BaseExpression) {
        this.assignVariable(GL_POSITION, assignment);
        return this;
    }
}

export class VertexShaderBuilder extends ShaderBuilder {

    protected attributes: ShaderAttribute[] = [];
    protected varyings: ShaderVarying[] = [];

    constructor(glVersion: GLVersion) {
        super();
        this.version = glVersion;
    }

    addAttribute(name: string, type: GLSLType) {
        this.attributes.push({ type: type, name: name });
        return this;
    }

    addVarying(name: string, type: GLSLType) {
        this.varyings.push({ direction: "out", type: type, name: name });
        return this;
    }

    setMain(builder: VertexShaderMainBuilder) {
        this.mainMethod = builder;
        return this;
    }

    protected buildGlobalDeclarations(baseGlobalDeclarations: string): string {
        const attributeDeclarations = this.attributes.map(attribute => {
            return AttributeGenerator.generateAttribute(attribute, this.version);
        }).join("\n");
        const varyingDeclarations = this.varyings.map(varying => {
            return VaryingGenerator.generateVarying(varying, this.version);
        }).join("\n");

        return [baseGlobalDeclarations, attributeDeclarations, varyingDeclarations].join("\n");
    }

    protected assembleShader(shaderText: string): Shader {
        return new VertexShader(shaderText, this.uniforms, this.attributes, this.varyings);
    }
}
