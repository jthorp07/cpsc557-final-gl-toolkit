/**
 * @file PrimitiveLiteral.ts
 *
 * @brief GLSL literal expression validation for primitives
 */
import { isInteger, isPositiveInteger } from "../../../Core/Assert.js";
export class PrimitiveLiteral {
    static bool(value) {
        return (value ? "true" : "false");
    }
    static int(value) {
        if (!isInteger(value))
            throw new Error(`Invalid int literal: ${value} is not an integer`);
        return `${value}`;
    }
    static uint(value) {
        if (!isPositiveInteger(value))
            throw new Error(`Invalid uint literal: ${value} is not a positive integer`);
        return `${value}u`;
    }
    static float(value) {
        if (Number.isNaN(value))
            throw new Error(`Invalid float literal: ${value} is not a number`);
        const literal = value.toString();
        if (literal.includes("."))
            return literal;
        if (literal.includes("e") || literal.includes("E")) {
            const [integral, fractional] = literal.split(/[eE]/);
            return `${integral}.E${fractional}`;
        }
        return `${literal}.`;
    }
    static double(value) {
        try {
            return `${PrimitiveLiteral.float(value)}lf`;
        }
        catch (err) {
            throw new Error(`Invalid double literal: ${value} is not a number`);
        }
    }
}
