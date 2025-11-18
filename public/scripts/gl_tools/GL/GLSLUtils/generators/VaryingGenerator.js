/**
 * @file VaryingGenerator.ts
 *
 * @brief Codegen for varying (vertex out, fragment in) parameter declarations
 */
export class VaryingGenerator {
    static generateVarying(varying, glVersion = 1) {
        if (glVersion == 1) {
            return `varying ${varying.type} ${varying.name};`;
        }
        return `${varying.direction} ${varying.type} ${varying.name};`;
    }
}
;
