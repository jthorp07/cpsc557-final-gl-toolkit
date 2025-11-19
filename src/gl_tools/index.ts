/**
 * @module gl_tools
 * 
 * @brief A toolkit wrapping the WebGL and WebGL2 APIs to provide a simple
 *        scene-based animation system with simple prefabs, textures, and animations.
 */

export {
    Scene, GLApp, ResourceLoader, RenderObject,
    assertNotNull, assertNotUndefined, assertNarrowableTo, assert,
    GLCamera, GLLight
} from "./Core/index.js";
export { 
    GLContext, ShaderProgram, GLVersion, PackedGLShape, PackedGLBuffer,
    ShaderUniform, ShaderVarying, ShaderAttribute,
    ShaderBuilder, ShaderMainMethodBuilder,
    VertexShaderBuilder, VertexShaderMainBuilder,
    FragmentShaderBuilder, FragmentShaderMainBuilder,
    AttributeGenerator, PrecisionGenerator, StatementGenerator,
    UniformGenerator, VaryingGenerator, VersionGenerator,
    BaseExpression, BooleanExpression, LiteralExpression, VariableExpression,
    ArithmeticExpression, InvokationExpression,
    Statement, DeclarationStatement, AssignmentStatement, IfStatement,
    GLSLType, requiresWebGL2, PrecisionLevel,
    PrimitiveLiteral, VectorLiteral,
    makeGenericVertexShader, makeGenericFragmentShader
} from "./GL/index.js";
export {
    Vector2, Vector3, Vector4, flattenVectors,
    Matrix3, Matrix4, Transform
} from "./MatrixMath/index.js";
export {
    BaseShape, Cube, Sphere, Plane, RectangularPyramid,
    GLColor, BaseTexture, SolidColorTexture, PerVertexColorTexture
} from "./Prefabs/index.js";
