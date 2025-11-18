/**
 * @module language
 * 
 * @brief GLSL language model for frontend representation
 */

export { GLSLType, requiresWebGL2 } from "./GLSLTypes.js";
export {
    BaseExpression, ArithmeticExpression, LiteralExpression, VariableExpression, InvokationExpression,
    Statement, DeclarationStatement, AssignmentStatement
} from "./GLSLGrammar.js";
