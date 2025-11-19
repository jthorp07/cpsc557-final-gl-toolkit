/**
 * @file PrecisionGenerator.ts
 * 
 * @brief Codegen for precision declarations
 */

import { PrecisionDeclaration } from "../../types.js";

/**
 * @class PrecisionGenerator
 * 
 * @brief Generator for precision declarations
 */
export class PrecisionGenerator {

    /**
     * @brief Generates a precision declaration string
     * 
     * @param declaration The precision declaration
     * @returns The precision declaration string
     */
    static generatePrecisionDeclaration(declaration: PrecisionDeclaration) {
        return `precision ${declaration.precision} ${declaration.target};`;
    }
};
