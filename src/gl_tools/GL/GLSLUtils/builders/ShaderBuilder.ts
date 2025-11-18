/**
 * @file ShaderBuilder.ts
 * 
 * @brief Abstract base shader builder class
 */

import { Shader } from "../../Shader.js";
import { GLVersion, PrecisionDeclaration, PrecisionLevel, ShaderUniform } from "../../types.js";
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

    constructor(globalVariables: VariableExpression[]) {
        globalVariables.map(variable => {
            this.validIdentifiers.set(variable.variableName, variable.type());
        });
    }

    declareLocalVariable(type: GLSLType, name: string, assignment?: BaseExpression) {

        if (this.validIdentifiers.has(name)) throw new Error(`A variable already exists with name ${name}`);

        this.statements.push(new DeclarationStatement(
            new VariableExpression(type, name),
            assignment
        ));

        return this;
    }

    assignVariable(name: string, assignment: BaseExpression) {

        const variableType = this.validIdentifiers.get(name);
        if (!variableType) throw new Error(`No variable exists with name ${name}`);

        this.statements.push(new AssignmentStatement(
            new VariableExpression(variableType, name),
            assignment
        ));

        return this;
    }

    addIf(ifStatement: IfStatement) {
        this.statements.push(ifStatement);
        return this;
    }

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

    setVersion(version: GLVersion) {
        this.version = version;
        return this;
    }

    addPrecisionStatement(level: PrecisionLevel, target: GLSLType) {
        this.globalPrecisionDeclarations.push({ precision: level, target: target });
        return this;
    }

    addUniform(name: string, type: GLSLType) {
        this.uniforms.push({ name: name, type: type });
        return this;
    }

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

    protected abstract buildGlobalDeclarations(baseGlobalDeclarations: string): string;

    protected abstract assembleShader(shaderText: string): Shader;

};
