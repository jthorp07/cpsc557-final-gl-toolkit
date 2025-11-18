/**
 * @file GLSLTypes.ts
 *
 * @brief Exports a type for valid GLSL types and a predicate to determine whether a type
 *        requires WebGL2
 */
const WEBGL_1_TYPES = new Set([
    "void", "bool", "int", "float",
    "vec2", "vec3", "vec4",
    "bvec2", "bvec3", "bvec4",
    "ivec2", "ivec3", "ivec4",
    "mat2", "mat3", "mat4",
    "sampler2D", "samplerCube"
]);
export function requiresWebGL2(type) {
    return !(WEBGL_1_TYPES.has(type));
}
