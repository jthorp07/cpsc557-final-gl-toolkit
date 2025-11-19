/**
 * @file UniformGenerator.ts
 * 
 * @brief Codegen for uniform parameters
 */

import { ShaderUniform } from "../../types.js";

/**
 * @class UniformGenerator
 * 
 * @brief Generator for uniform declarations
 */
export class UniformGenerator {

    /**
     * @brief Generates a uniform declaration string
     * 
     * @param uniform The uniform to generate
     * @returns The uniform declaration string
     */
    static generateUniform(uniform: ShaderUniform) {
        return `uniform ${uniform.type} ${uniform.name};`;
    }
};
