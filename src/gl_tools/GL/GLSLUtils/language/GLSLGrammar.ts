/**
 * @file GLSLGrammar.ts
 * 
 * @brief Abstract grammar representation types for GLSL statements and expressions
 */

import { GLSLType } from "./GLSLTypes.js";
import { ValidGLSLPrimitive } from "./PrimitiveLiteral.js";

/**
 * @brief Interface for all GLSL expressions
 */
export interface BaseExpression {
    type(): GLSLType;
    isArithmetic: () => this is ArithmeticExpression;
    isLiteral: () => this is LiteralExpression;
    isVariable: () => this is VariableExpression;
    isInvokation: () => this is InvokationExpression;
    isProperty: () => this is PropertyExpression;
    isBoolean: () => this is BooleanExpression;
};

/**
 * @class ArithmeticExpression
 * 
 * @brief Represents an arithmetic expression in GLSL
 */
export class ArithmeticExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly operandOne: BaseExpression;
    readonly operandTwo: BaseExpression;
    readonly operator: string;

    /**
     * @brief Creates a new ArithmeticExpression
     * 
     * @param dataType The result type of the expression
     * @param operandOne The first operand
     * @param operandTwo The second operand
     * @param operator The operator string
     */
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

/**
 * @class LiteralExpression
 * 
 * @brief Represents a literal value in GLSL
 */
export class LiteralExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly value: ValidGLSLPrimitive;

    /**
     * @brief Creates a new LiteralExpression
     * 
     * @param dataType The type of the literal
     * @param value The literal value
     */
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

/**
 * @class VariableExpression
 * 
 * @brief Represents a variable reference in GLSL
 */
export class VariableExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly variableName: string;

    /**
     * @brief Creates a new VariableExpression
     * 
     * @param dataType The type of the variable
     * @param variableName The name of the variable
     */
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

/**
 * @class PropertyExpression
 * 
 * @brief Represents a property access expression in GLSL (e.g., struct member)
 */
export class PropertyExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly variableName: string;
    readonly propertyName: string;

    /**
     * @brief Creates a new PropertyExpression
     * 
     * @param dataType The type of the property
     * @param variable The variable being accessed
     * @param propertyName The name of the property
     */
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

/**
 * @class InvokationExpression
 * 
 * @brief Represents a function invocation in GLSL
 */
export class InvokationExpression implements BaseExpression {

    private readonly dataType: GLSLType;
    readonly callableName: string;
    readonly arguments: BaseExpression[];

    /**
     * @brief Creates a new InvokationExpression
     * 
     * @param dataType The return type of the function
     * @param callableName The name of the function
     * @param args The arguments passed to the function
     */
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

/**
 * @class BooleanExpression
 * 
 * @brief Represents a boolean expression in GLSL
 */
export class BooleanExpression implements BaseExpression {

    readonly expression: BaseExpression;

    /**
     * @brief Creates a new BooleanExpression
     * 
     * @param expression The underlying boolean expression
     */
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

/**
 * @brief Interface for all GLSL statements
 */
export interface Statement {
    isDeclaration: () => this is DeclarationStatement;
    isAssignment: () => this is AssignmentStatement;
    isIf: () => this is IfStatement;
};

/**
 * @class DeclarationStatement
 * 
 * @brief Represents a variable declaration statement in GLSL
 */
export class DeclarationStatement implements Statement {

    readonly identifier: VariableExpression;
    readonly initializer?: BaseExpression;

    /**
     * @brief Creates a new DeclarationStatement
     * 
     * @param identifier The variable being declared
     * @param initializer Optional initial value
     */
    constructor(identifier: VariableExpression, initializer?: BaseExpression) {
        this.identifier = identifier;
        this.initializer = initializer;
    }

    isDeclaration(): this is DeclarationStatement { return true; };
    isAssignment(): this is AssignmentStatement { return false; };
    isIf(): this is IfStatement { return false; };
};

/**
 * @class AssignmentStatement
 * 
 * @brief Represents a variable assignment statement in GLSL
 */
export class AssignmentStatement implements Statement {

    readonly identifier: VariableExpression;
    readonly initializer: BaseExpression;

    /**
     * @brief Creates a new AssignmentStatement
     * 
     * @param identifier The variable being assigned to
     * @param initializer The value being assigned
     */
    constructor(identifier: VariableExpression, initializer: BaseExpression) {
        this.identifier = identifier;
        this.initializer = initializer;
    }

    isDeclaration(): this is DeclarationStatement { return false; };
    isAssignment(): this is AssignmentStatement { return true; };
    isIf(): this is IfStatement { return false; };
};

/**
 * @class IfStatement
 * 
 * @brief Represents an if-else statement in GLSL
 */
export class IfStatement implements Statement {

    readonly conditionals: [BooleanExpression, Statement[]][];
    readonly ifElse: Statement[] | undefined;

    /**
     * @brief Creates a new IfStatement
     * 
     * @param conditionals List of condition-statement pairs
     * @param ifElse Optional else block statements
     */
    constructor(conditionals: [BooleanExpression, Statement[]][], ifElse?: Statement[]) {
        this.conditionals = conditionals;
        this.ifElse = ifElse;
    }

    isDeclaration(): this is DeclarationStatement { return false; };
    isAssignment(): this is AssignmentStatement { return false; };
    isIf(): this is IfStatement { return true; };
}
