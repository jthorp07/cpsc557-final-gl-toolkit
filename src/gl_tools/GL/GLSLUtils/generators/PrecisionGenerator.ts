/**
 * @file PrecisionGenerator.ts
 * 
 * @brief Codegen for precision declarations
 */

import { PrecisionDeclaration } from "../../types.js";

export class PrecisionGenerator {

    static generatePrecisionDeclaration(declaration: PrecisionDeclaration) {
        return `precision ${declaration.precision} ${declaration.target};`;
    }
};
