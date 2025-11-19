/**
 * @file GLSLTypes.ts
 * 
 * @brief Exports a type for valid GLSL types and a predicate to determine whether a type
 *        requires WebGL2
 */

/**
 * @brief Union type of all valid GLSL types supported by this library
 */
export type GLSLType = "void" | "bool" | "int" | "float" |
    // Vectors
    "vec2" | "vec3" | "vec4" |
    "bvec2" | "bvec3" | "bvec4" |
    "ivec2" | "ivec3" | "ivec4" |
    "uvec2" | "uvec3" | "uvec4" |
    // Matrices
    "mat2" | "mat3" | "mat4" |
    "mat2x3" | "mat2x4" | "mat3x2" | "mat3x4" | "mat4x2" | "mat4x3" |
    // Floating point samplers
    "sampler2D" | "samplerCube" | "sampler3D" | "samplerCubeShadow" |
    "sampler2DShadow" | "sampler2DArray" | "sampler2DArrayShadow" |
    // Signed samplers
    "isampler2D" | "isampler3D" | "isamplerCube" | "isampler2DArray" |
    // Unsigned samplers
    "usampler2D" | "usampler3D" | "usamplerCube" | "usampler2DArray"

const WEBGL_1_TYPES = new Set<GLSLType>([
    "void", "bool", "int", "float",
    "vec2", "vec3", "vec4",
    "bvec2", "bvec3", "bvec4",
    "ivec2", "ivec3", "ivec4",
    "mat2", "mat3", "mat4",
    "sampler2D", "samplerCube"
]);

/**
 * @brief Checks if a GLSL type requires WebGL 2.0
 * 
 * @param type The GLSL type to check
 * @returns True if the type requires WebGL 2.0, false otherwise
 */
export function requiresWebGL2(type: GLSLType) {
    return !(WEBGL_1_TYPES.has(type));
}
/**
 * @brief Precision declaration keywords
 */
export type PrecisionLevel = "lowp" | "mediump" | "highp";
