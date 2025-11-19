/**
 * @module GL
 * 
 * @brief Direct WebGL API wrappers and WebGL/GLSL frontend representations
 */

export { GLContext } from "./GLContext.js";
export { ShaderProgram } from "./Shaders/ShaderProgram.js";
export {
    GLVersion, PackedGLShape, PackedGLBuffer,
    ShaderUniform, ShaderVarying, ShaderAttribute
} from "./types.js";
export {
    // builders
    ShaderBuilder, ShaderMainMethodBuilder,
    VertexShaderBuilder, VertexShaderMainBuilder,
    FragmentShaderBuilder, FragmentShaderMainBuilder,
    // generators
    AttributeGenerator, PrecisionGenerator, StatementGenerator,
    UniformGenerator, VaryingGenerator, VersionGenerator,
    // language
    BaseExpression, BooleanExpression, LiteralExpression, VariableExpression,
    ArithmeticExpression, InvokationExpression,
    Statement, DeclarationStatement, AssignmentStatement, IfStatement,
    GLSLType, requiresWebGL2, PrecisionLevel,
    PrimitiveLiteral, VectorLiteral,
    // templates
    makeGenericVertexShader, makeGenericFragmentShader
} from "./GLSLUtils/index.js";
