/**
 * @file ShaderBuilder.ts
 *
 * @brief Abstract base shader builder class
 */
import { PrecisionGenerator, StatementGenerator, UniformGenerator, VersionGenerator } from "../generators/index.js";
import { AssignmentStatement, DeclarationStatement, VariableExpression } from "../language/GLSLGrammar.js";
/**
 * @class ShaderMainMethodBuilder
 *
 * @brief Abstract builder class that constructs
 */
export class ShaderMainMethodBuilder {
    constructor(globalVariables) {
        this.validIdentifiers = new Map();
        this.statements = [];
        globalVariables.map(variable => {
            this.validIdentifiers.set(variable.variableName, variable.type());
        });
    }
    declareLocalVariable(type, name, assignment) {
        if (this.validIdentifiers.has(name))
            throw new Error(`A variable already exists with name ${name}`);
        this.statements.push(new DeclarationStatement(new VariableExpression(type, name), assignment));
        return this;
    }
    assignVariable(name, assignment) {
        const variableType = this.validIdentifiers.get(name);
        if (!variableType)
            throw new Error(`No variable exists with name ${name}`);
        this.statements.push(new AssignmentStatement(new VariableExpression(variableType, name), assignment));
        return this;
    }
    addIf(ifStatement) {
        this.statements.push(ifStatement);
        return this;
    }
    build() {
        const statements = this.statements.map(statement => {
            return `    ${StatementGenerator.generateStatement(statement)}`;
        });
        return `void main() {\n${statements.join("\n")}\n}`;
    }
}
;
/**
 * @class ShaderBuilder
 *
 * @brief Abstract builder class that represents a WebGL shader. Runs checks to ensure shader
 *        validity.
 */
export class ShaderBuilder {
    constructor() {
        this.version = 2;
        this.uniforms = [];
        this.globalPrecisionDeclarations = [];
        this.mainMethod = undefined;
        this._identifiers = new Map();
    }
    setVersion(version) {
        this.version = version;
        return this;
    }
    addPrecisionStatement(level, target) {
        this.globalPrecisionDeclarations.push({ precision: level, target: target });
        return this;
    }
    addUniform(name, type) {
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
            return UniformGenerator.generateUniform(uniform);
        }).join("\n");
        const baseGlobalDeclarations = `${versionDeclaration}\n${precisionDeclarations}\n${uniformDeclarations}\n`;
        const globalDeclarations = this.buildGlobalDeclarations(baseGlobalDeclarations);
        const mainMethod = this.mainMethod.build();
        const text = `${globalDeclarations}\n\n${mainMethod}\n`;
        return this.assembleShader(text);
    }
}
;
