/**
 * @file PrimitiveLiteral.ts
 * 
 * @brief GLSL literal expression validation for primitives
 */

import { isInteger, isPositiveInteger } from "../../../Core/Assert.js";

export type ValidGLSLPrimitive = string & { __brand: "glsl_primitive" };

/**
 * @class PrimitiveLiteral
 * 
 * @brief Utilities for creating valid GLSL primitive literals
 */
export class PrimitiveLiteral {
    /**
     * @brief Creates a boolean literal
     * 
     * @param value The boolean value
     * @returns The GLSL boolean literal
     */
    static bool(value: boolean) {
        return (value ? "true" : "false") as ValidGLSLPrimitive;
    }

    /**
     * @brief Creates an integer literal
     * 
     * @param value The integer value
     * @returns The GLSL integer literal
     */
    static int(value: number) {
        if (!isInteger(value)) throw new Error(`Invalid int literal: ${value} is not an integer`);
        return `${value}` as ValidGLSLPrimitive;
    }

    /**
     * @brief Creates an unsigned integer literal
     * 
     * @param value The unsigned integer value
     * @returns The GLSL unsigned integer literal
     */
    static uint(value: number) {
        if (!isPositiveInteger(value)) throw new Error(`Invalid uint literal: ${value} is not a positive integer`);
        return `${value}u` as ValidGLSLPrimitive;
    }

    /**
     * @brief Creates a float literal
     * 
     * @param value The float value
     * @returns The GLSL float literal
     */
    static float(value: number) {
        if (Number.isNaN(value)) throw new Error(`Invalid float literal: ${value} is not a number`);
        const literal = value.toString();
        if (literal.includes(".")) return literal as ValidGLSLPrimitive;
        if (literal.includes("e") || literal.includes("E")) {
            const [integral, fractional] = literal.split(/[eE]/);
            return `${integral}.E${fractional}` as ValidGLSLPrimitive;
        }
        return `${literal}.` as ValidGLSLPrimitive;
    }

    /**
     * @brief Creates a double literal
     * 
     * @param value The double value
     * @returns The GLSL double literal
     */
    static double(value: number) {
        try {
            return `${PrimitiveLiteral.float(value)}lf` as ValidGLSLPrimitive;
        } catch (err) {
            throw new Error(`Invalid double literal: ${value} is not a number`)
        }
    }
}
