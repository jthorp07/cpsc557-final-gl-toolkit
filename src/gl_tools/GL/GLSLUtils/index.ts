/**
 * @module GLSLUtils
 * 
 * @brief GLSL model and code generation for the frontend
 */

export {
    ShaderBuilder, ShaderMainMethodBuilder,
    VertexShaderBuilder, VertexShaderMainBuilder,
    FragmentShaderBuilder, FragmentShaderMainBuilder
} from "./builders/index.js";
export {
    AttributeGenerator, PrecisionGenerator, StatementGenerator,
    UniformGenerator, VaryingGenerator, VersionGenerator
} from "./generators/index.js";
export {
    // Grammar - Expressions
    BaseExpression, BooleanExpression, LiteralExpression, VariableExpression,
    ArithmeticExpression, InvokationExpression,
    // Grammar - Statements
    Statement, DeclarationStatement, AssignmentStatement, IfStatement,
    // Types
    GLSLType, requiresWebGL2, PrecisionLevel,
    // Literals
    PrimitiveLiteral,
    VectorLiteral
} from "./language/index.js";
export { makeGenericVertexShader, makeGenericFragmentShader } from "./templates/index.js";
