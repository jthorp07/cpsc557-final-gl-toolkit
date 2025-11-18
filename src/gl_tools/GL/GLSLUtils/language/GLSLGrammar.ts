/**
 * @file GLSLGrammar.ts
 * 
 * @brief Abstract grammar representation types for GLSL statements and expressions
 */

import { GLSLType } from "./GLSLTypes.js";
import { ValidGLSLPrimitive } from "./PrimitiveLiteral.js";

export interface BaseExpression {
    type(): GLSLType;
    isArithmetic: () => this is ArithmeticExpression;
    isLiteral: () => this is LiteralExpression;
    isVariable: () => this is VariableExpression;
    isInvokation: () => this is InvokationExpression;
    isProperty: () => this is PropertyExpression;
    isBoolean: () => this is BooleanExpression;
};

export class ArithmeticExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly operandOne: BaseExpression;
    readonly operandTwo: BaseExpression;
    readonly operator: string;

    constructor(
        dataType: GLSLType, operandOne: BaseExpression,
        operandTwo: BaseExpression, operator: string
    ) {
        this.dataType = dataType;
        this.operandOne = operandOne;
        this.operandTwo = operandTwo;
        this.operator = operator;
    }

    type() { return this.dataType; };
    isArithmetic(): this is ArithmeticExpression { return true; };
    isLiteral(): this is LiteralExpression { return false; };
    isVariable(): this is VariableExpression { return false; };
    isInvokation(): this is InvokationExpression { return false; };
    isProperty(): this is PropertyExpression { return false; };
    isBoolean(): this is BooleanExpression { return false; };
};

export class LiteralExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly value: ValidGLSLPrimitive;

    constructor(dataType: GLSLType, value: ValidGLSLPrimitive) {
        this.dataType = dataType;
        this.value = value;
    }

    type() { return this.dataType; };
    isArithmetic(): this is ArithmeticExpression { return false; };
    isLiteral(): this is LiteralExpression { return true; };
    isVariable(): this is VariableExpression { return false; };
    isInvokation(): this is InvokationExpression { return false; };
    isProperty(): this is PropertyExpression { return false; };
    isBoolean(): this is BooleanExpression { return false; };
};

export class VariableExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly variableName: string;

    constructor(dataType: GLSLType, variableName: string) {
        this.dataType = dataType;
        this.variableName = variableName;
    }

    type() { return this.dataType; };
    isArithmetic(): this is ArithmeticExpression { return false; };
    isLiteral(): this is LiteralExpression { return false; };
    isVariable(): this is VariableExpression { return true; };
    isInvokation(): this is InvokationExpression { return false; };
    isProperty(): this is PropertyExpression { return false; };
    isBoolean(): this is BooleanExpression { return false; };
};

export class PropertyExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly variableName: string;
    readonly propertyName: string;

    constructor(dataType: GLSLType, variable: VariableExpression, propertyName: string) {
        this.dataType = dataType;
        this.variableName = variable.variableName;
        this.propertyName = propertyName;
    }

    type() { return this.dataType; };
    isArithmetic(): this is ArithmeticExpression { return false; };
    isLiteral(): this is LiteralExpression { return false; };
    isVariable(): this is VariableExpression { return false; };
    isInvokation(): this is InvokationExpression { return false; };
    isProperty(): this is PropertyExpression { return true; };
    isBoolean(): this is BooleanExpression { return false; };
}

export class InvokationExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly callableName: string;
    readonly arguments: BaseExpression[];

    constructor(dataType: GLSLType, callableName: string, args: BaseExpression[]) {
        this.dataType = dataType;
        this.callableName = callableName;
        this.arguments = args;
    }

    type() { return this.dataType; };
    isArithmetic(): this is ArithmeticExpression { return false; };
    isLiteral(): this is LiteralExpression { return false; };
    isVariable(): this is VariableExpression { return false; };
    isInvokation(): this is InvokationExpression { return true; };
    isProperty(): this is PropertyExpression { return false; };
    isBoolean(): this is BooleanExpression { return false; };
};

export class BooleanExpression implements BaseExpression {

    readonly expression: BaseExpression;

    constructor(expression: BaseExpression) {
        if (expression.type() !== "bool") throw new Error("Not a boolean expression");
        this.expression = expression;
    }

    type() { return "bool" as GLSLType; };
    isArithmetic(): this is ArithmeticExpression { return false; };
    isLiteral(): this is LiteralExpression { return false; };
    isVariable(): this is VariableExpression { return false; };
    isInvokation(): this is InvokationExpression { return false; };
    isProperty(): this is PropertyExpression { return false; };
    isBoolean(): this is BooleanExpression { return true; };
}

export interface Statement {
    isDeclaration: () => this is DeclarationStatement;
    isAssignment: () => this is AssignmentStatement;
    isIf: () => this is IfStatement;
};

export class DeclarationStatement implements Statement {

    readonly identifier: VariableExpression;
    readonly initializer?: BaseExpression;

    constructor(identifier: VariableExpression, initializer?: BaseExpression) {
        this.identifier = identifier;
        this.initializer = initializer;
    }

    isDeclaration(): this is DeclarationStatement { return true; };
    isAssignment(): this is AssignmentStatement { return false; };
    isIf(): this is IfStatement { return false; };
};

export class AssignmentStatement implements Statement {

    readonly identifier: VariableExpression;
    readonly initializer: BaseExpression;

    constructor(identifier: VariableExpression, initializer: BaseExpression) {
        this.identifier = identifier;
        this.initializer = initializer;
    }

    isDeclaration(): this is DeclarationStatement { return false; };
    isAssignment(): this is AssignmentStatement { return true; };
    isIf(): this is IfStatement { return false; };
};

export class IfStatement implements Statement {

    readonly conditionals: [BooleanExpression, Statement[]][];
    readonly ifElse: Statement[] | undefined;

    constructor(conditionals: [BooleanExpression, Statement[]][], ifElse?: Statement[]) {
        this.conditionals = conditionals;
        this.ifElse = ifElse;
    }

    isDeclaration(): this is DeclarationStatement { return false; };
    isAssignment(): this is AssignmentStatement { return false; };
    isIf(): this is IfStatement { return true; };
}
