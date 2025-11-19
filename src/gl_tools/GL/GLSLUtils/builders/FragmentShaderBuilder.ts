/**
 * @file FragmentShaderBuilder.ts
 * 
 * @brief Builder class for GLSL fragment shaders
 */

import { FragmentShader, Shader } from "../../Shaders/Shader.js";
import { GLVersion, ShaderVarying } from "../../types.js";
import { VaryingGenerator } from "../generators/VaryingGenerator.js";
import { BaseExpression, VariableExpression } from "../language/GLSLGrammar.js";
import { GLSLType } from "../language/GLSLTypes.js";
import { ShaderBuilder, ShaderMainMethodBuilder } from "./ShaderBuilder.js";

const GL_FRAGCOLOR = "gl_FragColor" as const;
const OUT_FRAGCOLOR = "fragColor" as const;

/**
 * @class FragmentShaderMainBuilder
 * 
 * @brief Builder for the main method of a fragment shader
 */
export class FragmentShaderMainBuilder extends ShaderMainMethodBuilder {

    protected readonly fragColorOut: string;

    /**
     * @brief Creates a new FragmentShaderMainBuilder
     * 
     * @param globalVariables Global variables available in the main method
     * @param version GLSL version
     */
    constructor(globalVariables: VariableExpression[], version: GLVersion) {
        super(globalVariables);
        this.fragColorOut = version === 1 ? GL_FRAGCOLOR : OUT_FRAGCOLOR;
        this.validIdentifiers.set(this.fragColorOut, "vec4");
    }

    /**
     * @brief Assigns a value to the fragment color output
     * 
     * @param assignment Expression to assign
     * @returns This builder
     */
    assignGLFragColor(assignment: BaseExpression) {
        this.assignVariable(this.fragColorOut, assignment)
        return this;
    }
};

/**
 * @class FragmentShaderBuilder
 * 
 * @brief Builder for fragment shaders
 */
export class FragmentShaderBuilder extends ShaderBuilder {

    protected varyings: ShaderVarying[] = [];

    /**
     * @brief Creates a new FragmentShaderBuilder
     * 
     * @param version GLSL version
     */
    constructor(version: GLVersion) {
        super();
        this.version = version;
    }

    /**
     * @brief Adds a varying variable to the shader
     * 
     * @param name Name of the varying
     * @param type Type of the varying
     * @returns This builder
     */
    addVarying(name: string, type: GLSLType) {
        this.varyings.push({ direction: "in", type: type, name: name });
        return this;
    }

    /**
     * @brief Sets the main method builder
     * 
     * @param builder The main method builder
     * @returns This builder
     */
    setMain(builder: FragmentShaderMainBuilder) {
        this.mainMethod = builder;
        return this;
    }

    /**
     * @brief Builds the global variable declarations string
     * 
     * @param baseGlobalDeclarations Base declarations (version, precision, uniforms)
     * @returns The complete global declarations string
     */
    protected buildGlobalDeclarations(baseGlobalDeclarations: string): string {
        const varyingDeclarations = this.varyings.map(varying => {
            return VaryingGenerator.generateVarying(varying, this.version);
        }).join("\n");

        return [baseGlobalDeclarations, varyingDeclarations].join("\n");
    }

    /**
     * @brief Assembles the final Shader object
     * 
     * @param shaderText The complete shader source code
     * @returns The created FragmentShader
     */
    protected assembleShader(shaderText: string): Shader {
        return new FragmentShader(shaderText, this.uniforms);
    }
};
