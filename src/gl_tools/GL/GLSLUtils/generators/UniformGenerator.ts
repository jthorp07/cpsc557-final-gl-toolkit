/**
 * @file UniformGenerator.ts
 * 
 * @brief Codegen for uniform parameters
 */

import { ShaderUniform } from "../../types.js";

export class UniformGenerator {

    static generateUniform(uniform: ShaderUniform) {
        return `uniform ${uniform.type} ${uniform.name};`;
    }
};
