/**
 * @file VaryingGenerator.ts
 * 
 * @brief Codegen for varying (vertex out, fragment in) parameter declarations
 */

import { ShaderVarying } from "../../types.js";

/**
 * @class VaryingGenerator
 * 
 * @brief Generator for varying declarations
 */
export class VaryingGenerator {

    /**
     * @brief Generates a varying declaration string
     * 
     * @param varying The varying to generate
     * @param glVersion The GLSL version
     * @returns The varying declaration string
     */
    static generateVarying(varying: ShaderVarying, glVersion: 1 | 2 = 1) {
        if (glVersion == 1) {
            return `varying ${varying.type} ${varying.name};`;
        }
        return `${varying.direction} ${varying.type} ${varying.name};`;
    }
};
