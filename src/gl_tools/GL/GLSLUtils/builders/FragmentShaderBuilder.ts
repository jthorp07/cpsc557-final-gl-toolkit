/**
 * @file VertexShaderBuilder.ts
 * 
 * @brief Builder class for GLSL vertex shaders
 */

import { assertNotUndefined } from "../../../Core/Assert.js";
import { FragmentShader, Shader } from "../../Shader.js";
import { GLVersion, ShaderVarying } from "../../types.js";
import { VaryingGenerator } from "../generators/VaryingGenerator.js";
import { BaseExpression, VariableExpression } from "../language/GLSLGrammar.js";
import { GLSLType } from "../language/GLSLTypes.js";
import { ShaderBuilder, ShaderMainMethodBuilder } from "./ShaderBuilder.js";

const GL_FRAGCOLOR = "gl_FragColor" as const;
const OUT_FRAGCOLOR = "fragColor" as const;

export class FragmentShaderMainBuilder extends ShaderMainMethodBuilder {

    protected readonly fragColorOut: string;

    constructor(globalVariables: VariableExpression[], version: GLVersion) {
        super(globalVariables);
        this.fragColorOut = version === 1 ? GL_FRAGCOLOR : OUT_FRAGCOLOR;
        this.validIdentifiers.set(this.fragColorOut, "vec4");
    }

    assignGLFragColor(assignment: BaseExpression) {
        this.assignVariable(this.fragColorOut, assignment)
        return this;
    }
};

export class FragmentShaderBuilder extends ShaderBuilder {

    protected varyings: ShaderVarying[] = [];

    constructor(version: GLVersion) {
        super();
        this.version = version;
    }

    addVarying(name: string, type: GLSLType) {
        this.varyings.push({ direction: "in", type: type, name: name });
        return this;
    }

    setMain(builder: FragmentShaderMainBuilder) {
        this.mainMethod = builder;
        return this;
    }

    protected buildGlobalDeclarations(baseGlobalDeclarations: string): string {
        const varyingDeclarations = this.varyings.map(varying => {
            return VaryingGenerator.generateVarying(varying, this.version);
        }).join("\n");

        return [baseGlobalDeclarations, varyingDeclarations].join("\n");
    }

    protected assembleShader(shaderText: string): Shader {
        return new FragmentShader(shaderText, this.uniforms);
    }
};
