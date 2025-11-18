/**
 * @file PrimitiveLiteral.ts
 * 
 * @brief GLSL literal expression validation for primitives
 */

import { isInteger, isPositiveInteger } from "../../../Core/Assert.js";

export type ValidGLSLPrimitive = string & { __brand: "glsl_primitive" };

export class PrimitiveLiteral {
    static bool(value: boolean) {
        return (value ? "true" : "false") as ValidGLSLPrimitive;
    }

    static int(value: number) {
        if (!isInteger(value)) throw new Error(`Invalid int literal: ${value} is not an integer`);
        return `${value}` as ValidGLSLPrimitive;
    }

    static uint(value: number) {
        if (!isPositiveInteger(value)) throw new Error(`Invalid uint literal: ${value} is not a positive integer`);
        return `${value}u` as ValidGLSLPrimitive;
    }

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

    static double(value: number) {
        try {
            return `${PrimitiveLiteral.float(value)}lf` as ValidGLSLPrimitive;
        } catch (err) {
            throw new Error(`Invalid double literal: ${value} is not a number`)
        }
    }
}
