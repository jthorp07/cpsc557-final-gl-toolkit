/**
 * @file PrecisionGenerator.ts
 *
 * @brief Codegen for precision declarations
 */
export class PrecisionGenerator {
    static generatePrecisionDeclaration(declaration) {
        return `precision ${declaration.precision} ${declaration.target};`;
    }
}
;
