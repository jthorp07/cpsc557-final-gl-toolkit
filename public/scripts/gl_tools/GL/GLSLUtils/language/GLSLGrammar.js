/**
 * @file GLSLGrammar.ts
 *
 * @brief Abstract grammar representation types for GLSL statements and expressions
 */
;
export class ArithmeticExpression {
    constructor(dataType, operandOne, operandTwo, operator) {
        this.dataType = dataType;
        this.operandOne = operandOne;
        this.operandTwo = operandTwo;
        this.operator = operator;
    }
    type() { return this.dataType; }
    ;
    isArithmetic() { return true; }
    ;
    isLiteral() { return false; }
    ;
    isVariable() { return false; }
    ;
    isInvokation() { return false; }
    ;
    isProperty() { return false; }
    ;
    isBoolean() { return false; }
    ;
}
;
export class LiteralExpression {
    constructor(dataType, value) {
        this.dataType = dataType;
        this.value = value;
    }
    type() { return this.dataType; }
    ;
    isArithmetic() { return false; }
    ;
    isLiteral() { return true; }
    ;
    isVariable() { return false; }
    ;
    isInvokation() { return false; }
    ;
    isProperty() { return false; }
    ;
    isBoolean() { return false; }
    ;
}
;
export class VariableExpression {
    constructor(dataType, variableName) {
        this.dataType = dataType;
        this.variableName = variableName;
    }
    type() { return this.dataType; }
    ;
    isArithmetic() { return false; }
    ;
    isLiteral() { return false; }
    ;
    isVariable() { return true; }
    ;
    isInvokation() { return false; }
    ;
    isProperty() { return false; }
    ;
    isBoolean() { return false; }
    ;
}
;
export class PropertyExpression {
    constructor(dataType, variable, propertyName) {
        this.dataType = dataType;
        this.variableName = variable.variableName;
        this.propertyName = propertyName;
    }
    type() { return this.dataType; }
    ;
    isArithmetic() { return false; }
    ;
    isLiteral() { return false; }
    ;
    isVariable() { return false; }
    ;
    isInvokation() { return false; }
    ;
    isProperty() { return true; }
    ;
    isBoolean() { return false; }
    ;
}
export class InvokationExpression {
    constructor(dataType, callableName, args) {
        this.dataType = dataType;
        this.callableName = callableName;
        this.arguments = args;
    }
    type() { return this.dataType; }
    ;
    isArithmetic() { return false; }
    ;
    isLiteral() { return false; }
    ;
    isVariable() { return false; }
    ;
    isInvokation() { return true; }
    ;
    isProperty() { return false; }
    ;
    isBoolean() { return false; }
    ;
}
;
export class BooleanExpression {
    constructor(expression) {
        if (expression.type() !== "bool")
            throw new Error("Not a boolean expression");
        this.expression = expression;
    }
    type() { return "bool"; }
    ;
    isArithmetic() { return false; }
    ;
    isLiteral() { return false; }
    ;
    isVariable() { return false; }
    ;
    isInvokation() { return false; }
    ;
    isProperty() { return false; }
    ;
    isBoolean() { return true; }
    ;
}
;
export class DeclarationStatement {
    constructor(identifier, initializer) {
        this.identifier = identifier;
        this.initializer = initializer;
    }
    isDeclaration() { return true; }
    ;
    isAssignment() { return false; }
    ;
    isIf() { return false; }
    ;
}
;
export class AssignmentStatement {
    constructor(identifier, initializer) {
        this.identifier = identifier;
        this.initializer = initializer;
    }
    isDeclaration() { return false; }
    ;
    isAssignment() { return true; }
    ;
    isIf() { return false; }
    ;
}
;
export class IfStatement {
    constructor(conditionals, ifElse) {
        this.conditionals = conditionals;
        this.ifElse = ifElse;
    }
    isDeclaration() { return false; }
    ;
    isAssignment() { return false; }
    ;
    isIf() { return true; }
    ;
}
