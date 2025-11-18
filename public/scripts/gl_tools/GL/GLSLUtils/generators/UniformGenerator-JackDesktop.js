/**
 * @file UniformGenerator.ts
 *
 * @brief Codegen for shader uniform declarations
 */
export class UniformGenerator {
    static generateUniform(uniform, version = 1) {
        if (uniform.assignment !== undefined) {
            return `${uniform.type} ${uniform.name} = ${uniform.assignment};`;
        }
        return `${uniform.type} ${uniform.name};`;
    }
}
;
