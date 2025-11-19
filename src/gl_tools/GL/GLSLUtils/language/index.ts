/**
 * @module language
 * 
 * @brief GLSL language model for frontend representation
 */

export { GLSLType, requiresWebGL2, PrecisionLevel } from "./GLSLTypes.js";
export {
    BaseExpression, ArithmeticExpression, LiteralExpression, VariableExpression, InvokationExpression,
    BooleanExpression,
    Statement, DeclarationStatement, AssignmentStatement, IfStatement
} from "./GLSLGrammar.js";
export { PrimitiveLiteral } from "./PrimitiveLiteral.js";
export { VectorLiteral } from "./VectorLiteral.js";
