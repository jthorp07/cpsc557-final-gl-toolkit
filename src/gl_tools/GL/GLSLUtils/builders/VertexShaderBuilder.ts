/**
 * @file VertexShaderBuilder.ts
 * 
 * @brief Builder class for GLSL vertex shaders
 */

import { Shader, VertexShader } from "../../Shaders/Shader.js";
import { GLVersion, ShaderAttribute, ShaderVarying } from "../../types.js";
import { AttributeGenerator, VaryingGenerator } from "../generators/index.js";
import { BaseExpression, VariableExpression } from "../language/GLSLGrammar.js";
import { GLSLType } from "../language/GLSLTypes.js";
import { ShaderBuilder, ShaderMainMethodBuilder } from "./ShaderBuilder.js";

const GL_POSITION = "gl_Position" as const;

/**
 * @class VertexShaderMainBuilder
 * 
 * @brief Builder for the main method of a vertex shader
 */
export class VertexShaderMainBuilder extends ShaderMainMethodBuilder {

    /**
     * @brief Creates a new VertexShaderMainBuilder
     * 
     * @param globalVariables Global variables available in the main method
     */
    constructor(globalVariables: VariableExpression[]) {
        super(globalVariables);
        this.validIdentifiers.set("gl_Position", "vec4")
    }

    /**
     * @brief Assigns a value to the vertex position output
     * 
     * @param assignment Expression to assign
     * @returns This builder
     */
    assignGLPosition(assignment: BaseExpression) {
        this.assignVariable(GL_POSITION, assignment);
        return this;
    }
}

/**
 * @class VertexShaderBuilder
 * 
 * @brief Builder for vertex shaders
 */
export class VertexShaderBuilder extends ShaderBuilder {

    protected attributes: ShaderAttribute[] = [];
    protected varyings: ShaderVarying[] = [];

    /**
     * @brief Creates a new VertexShaderBuilder
     * 
     * @param glVersion GLSL version
     */
    constructor(glVersion: GLVersion) {
        super();
        this.version = glVersion;
    }

    /**
     * @brief Adds an attribute to the shader
     * 
     * @param name Name of the attribute
     * @param type Type of the attribute
     * @returns This builder
     */
    addAttribute(name: string, type: GLSLType) {
        this.attributes.push({ type: type, name: name });
        return this;
    }

    /**
     * @brief Adds a varying variable to the shader
     * 
     * @param name Name of the varying
     * @param type Type of the varying
     * @returns This builder
     */
    addVarying(name: string, type: GLSLType) {
        this.varyings.push({ direction: "out", type: type, name: name });
        return this;
    }

    /**
     * @brief Sets the main method builder
     * 
     * @param builder The main method builder
     * @returns This builder
     */
    setMain(builder: VertexShaderMainBuilder) {
        this.mainMethod = builder;
        return this;
    }

    /**
     * @brief Builds the global variable declarations string
     * 
     * @param baseGlobalDeclarations Base declarations
     * @returns The complete global declarations string
     */
    protected buildGlobalDeclarations(baseGlobalDeclarations: string): string {
        const attributeDeclarations = this.attributes.map(attribute => {
            return AttributeGenerator.generateAttribute(attribute, this.version);
        }).join("\n");
        const varyingDeclarations = this.varyings.map(varying => {
            return VaryingGenerator.generateVarying(varying, this.version);
        }).join("\n");

        return [baseGlobalDeclarations, attributeDeclarations, varyingDeclarations].join("\n");
    }

    /**
     * @brief Assembles the final Shader object
     * 
     * @param shaderText The complete shader source code
     * @returns The created VertexShader
     */
    protected assembleShader(shaderText: string): Shader {
        return new VertexShader(shaderText, this.uniforms, this.attributes, this.varyings);
    }
}
