/**
 * @file ShaderBuilder.ts
 * 
 * @brief Abstract base shader builder class
 */

import { Shader } from "../../Shader.js";
import { GLVersion, PrecisionDeclaration, ShaderUniform } from "../../types.js";
import { PrecisionLevel } from "../language/GLSLTypes.js";
import { PrecisionGenerator, StatementGenerator, UniformGenerator, VersionGenerator } from "../generators/index.js";
import { AssignmentStatement, BaseExpression, BooleanExpression, DeclarationStatement, IfStatement, Statement, VariableExpression } from "../language/GLSLGrammar.js";
import { GLSLType } from "../language/GLSLTypes.js";

/**
 * @class ShaderMainMethodBuilder
 * 
 * @brief Abstract builder class that constructs
 */
export abstract class ShaderMainMethodBuilder {

    protected validIdentifiers: Map<string, GLSLType> = new Map();
    private statements: Statement[] = [];

    /**
     * @brief Creates a new ShaderMainMethodBuilder
     * 
     * @param globalVariables Global variables available in the main method
     */
    constructor(globalVariables: VariableExpression[]) {
        globalVariables.map(variable => {
            this.validIdentifiers.set(variable.variableName, variable.type());
        });
    }

    /**
     * @brief Declares a local variable in the main method
     * 
     * @param type Type of the variable
     * @param name Name of the variable
     * @param assignment Optional initial value assignment
     * @returns This builder
     */
    declareLocalVariable(type: GLSLType, name: string, assignment?: BaseExpression) {

        if (this.validIdentifiers.has(name)) throw new Error(`A variable already exists with name ${name}`);

        this.statements.push(new DeclarationStatement(
            new VariableExpression(type, name),
            assignment
        ));

        return this;
    }

    /**
     * @brief Assigns a value to an existing variable
     * 
     * @param name Name of the variable
     * @param assignment Expression to assign
     * @returns This builder
     */
    assignVariable(name: string, assignment: BaseExpression) {

        const variableType = this.validIdentifiers.get(name);
        if (!variableType) throw new Error(`No variable exists with name ${name}`);

        this.statements.push(new AssignmentStatement(
            new VariableExpression(variableType, name),
            assignment
        ));

        return this;
    }

    /**
     * @brief Adds an if statement to the main method
     * 
     * @param ifStatement The if statement to add
     * @returns This builder
     */
    addIf(ifStatement: IfStatement) {
        this.statements.push(ifStatement);
        return this;
    }

    /**
     * @brief Builds the main method string
     * 
     * @returns The main method source code
     */
    build() {
        const statements = this.statements.map(statement => {
            return `    ${StatementGenerator.generateStatement(statement)}`;
        });
        return `void main() {\n${statements.join("\n")}\n}`;
    }
};

/**
 * @class ShaderBuilder
 * 
 * @brief Abstract builder class that represents a WebGL shader. Runs checks to ensure shader
 *        validity.
 */
export abstract class ShaderBuilder {

    protected version: GLVersion = 2;
    protected uniforms: ShaderUniform[] = [];
    protected globalPrecisionDeclarations: PrecisionDeclaration[] = [];
    protected mainMethod: ShaderMainMethodBuilder | undefined = undefined;
    protected _identifiers: Map<string, { lineDeclared: number, type: GLSLType }> = new Map();

    /**
     * @brief Sets the GLSL version
     * 
     * @param version GLSL version
     * @returns This builder
     */
    setVersion(version: GLVersion) {
        this.version = version;
        return this;
    }

    /**
     * @brief Adds a precision declaration
     * 
     * @param level Precision level
     * @param target Type target
     * @returns This builder
     */
    addPrecisionStatement(level: PrecisionLevel, target: GLSLType) {
        this.globalPrecisionDeclarations.push({ precision: level, target: target });
        return this;
    }

    /**
     * @brief Adds a uniform variable
     * 
     * @param name Name of the uniform
     * @param type Type of the uniform
     * @returns This builder
     */
    addUniform(name: string, type: GLSLType) {
        this.uniforms.push({ name: name, type: type });
        return this;
    }

    /**
     * @brief Builds the complete shader
     * 
     * @returns The created Shader object
     */
    build() {

        // Generate shader text
        const glVersion = this.version;
        const precisionDeclarations = this.globalPrecisionDeclarations.map(precisionDelcaration => {
            return PrecisionGenerator.generatePrecisionDeclaration(precisionDelcaration);
        }).join("\n");
        const versionDeclaration = VersionGenerator.generateVersionDeclaration(glVersion);
        const uniformDeclarations = this.uniforms.map(uniform => {
            return UniformGenerator.generateUniform(uniform)
        }).join("\n");
        const baseGlobalDeclarations = `${versionDeclaration}\n${precisionDeclarations}\n${uniformDeclarations}\n`;
        const globalDeclarations = this.buildGlobalDeclarations(baseGlobalDeclarations);
        const mainMethod = this.mainMethod.build();
        const text = `${globalDeclarations}\n\n${mainMethod}\n`;

        return this.assembleShader(text);
    }

    /**
     * @brief Builds the global variable declarations string
     * 
     * @param baseGlobalDeclarations Base declarations
     * @returns The complete global declarations string
     */
    protected abstract buildGlobalDeclarations(baseGlobalDeclarations: string): string;

    /**
     * @brief Assembles the final Shader object
     * 
     * @param shaderText The complete shader source code
     * @returns The created Shader
     */
    protected abstract assembleShader(shaderText: string): Shader;

};
