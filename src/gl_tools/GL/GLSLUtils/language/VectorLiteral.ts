/**
 * @file VectorLiteral.ts
 * 
 * @brief GLSL literal expression validation for vector constructors
 */

import { Vector2, Vector3, Vector4 } from "../../../MatrixMath/index.js";
import { PrimitiveLiteral, ValidGLSLPrimitive } from "./PrimitiveLiteral.js";

/**
 * @class VectorLiteral
 * 
 * @brief Utilities for creating valid GLSL vector literals
 */
export class VectorLiteral {

    /**
     * @brief Creates a vec2 literal
     * 
     * @param vector The Vector2 value
     * @returns The GLSL vec2 literal
     */
    static vec2(vector: Vector2) {
        const x = PrimitiveLiteral.float(vector.x);
        const y = PrimitiveLiteral.float(vector.y);
        return `vec2(${x}, ${y})` as ValidGLSLPrimitive;
    }

    /**
     * @brief Creates a vec3 literal
     * 
     * @param vector The Vector3 value
     * @returns The GLSL vec3 literal
     */
    static vec3(vector: Vector3) {
        const x = PrimitiveLiteral.float(vector.x);
        const y = PrimitiveLiteral.float(vector.y);
        const z = PrimitiveLiteral.float(vector.z);
        return `vec3(${x}, ${y}, ${z})` as ValidGLSLPrimitive;
    }

    /**
     * @brief Creates a vec4 literal
     * 
     * @param vector The Vector4 value
     * @returns The GLSL vec4 literal
     */
    static vec4(vector: Vector4) {
        const x = PrimitiveLiteral.float(vector.x);
        const y = PrimitiveLiteral.float(vector.y);
        const z = PrimitiveLiteral.float(vector.z);
        const w = PrimitiveLiteral.float(vector.w);
        return `vec4(${x}, ${y}, ${z}, ${w})` as ValidGLSLPrimitive;
    }
};
