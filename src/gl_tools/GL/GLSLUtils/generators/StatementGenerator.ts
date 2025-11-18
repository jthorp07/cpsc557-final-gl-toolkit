/**
 * @file ExpressionBuilder.ts
 * 
 * @brief Codegen for GLSL statements
 */

import { BaseExpression, Statement } from "../language/GLSLGrammar.js";

export class StatementGenerator {

    static generateStatement(statement: Statement): string {

        if (statement.isDeclaration()) {
            const signature = `${statement.identifier.type()} ${StatementGenerator.generateExpression(statement.identifier)}`;
            if (statement.initializer) {
                const assignment = StatementGenerator.generateExpression(statement.initializer);
                return `${signature} = ${assignment};`;
            }
            return `${signature};`
        }

        if (statement.isAssignment()) {
            const assignment = StatementGenerator.generateExpression(statement.initializer);
            return `${statement.identifier.variableName} = ${assignment};`
        }

        if (statement.isIf()) {
            const text = statement.conditionals.map(([condition, statements]) => {
                const conditionText = StatementGenerator.generateExpression(condition);
                const statementLines = statements.map(
                    (statement) => StatementGenerator.generateStatement(statement)
                ).join("\n    ");
                return `(${conditionText}) {\n    ${statementLines}\n  }`;
            }).join(" else if ");
            const elseStatements = statement.ifElse.map((statement) => {
                return StatementGenerator.generateStatement(statement);
            }).join("\n    ");
            const elseText = elseStatements === "" ? "" : ` else {\n    ${elseStatements}\n  }`;
            return `if ${text}${elseText}`;
        }

        throw new Error("Unsupported Statement Type");
    }

    private static generateExpression(expression: BaseExpression): string {

        if (expression.isVariable()) {
            return `${expression.variableName}`;
        }

        if (expression.isLiteral()) {
            return expression.value;
        }

        if (expression.isArithmetic()) {
            const operandOne = StatementGenerator.generateExpression(expression.operandOne);
            const operandTwo = StatementGenerator.generateExpression(expression.operandTwo);
            return `(${operandOne}) ${expression.operator} (${operandTwo})`;
        }

        if (expression.isInvokation()) {
            const argList = expression.arguments.map(arg => StatementGenerator.generateExpression(arg)).join(", ");
            return `${expression.callableName}(${argList})`;
        }

        if (expression.isProperty()) {
            return `${expression.variableName}.${expression.propertyName}`;
        }

        if (expression.isBoolean()) {
            return StatementGenerator.generateExpression(expression.expression);
        }

        throw new Error("Unsupported Expression Type");
    }
};
