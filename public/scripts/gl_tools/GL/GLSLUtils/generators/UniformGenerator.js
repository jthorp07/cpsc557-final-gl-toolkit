/**
 * @file UniformGenerator.ts
 *
 * @brief Codegen for uniform parameters
 */
export class UniformGenerator {
    static generateUniform(uniform) {
        return `uniform ${uniform.type} ${uniform.name};`;
    }
}
;
