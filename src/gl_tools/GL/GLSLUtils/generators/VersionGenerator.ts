/**
 * @file VersionGenerator.ts
 * 
 * @brief Codegen for version declaration statements
 */

import { GLVersion } from "../../types.js";

/**
 * @class VersionGenerator
 * 
 * @brief Generator for version declarations
 */
export class VersionGenerator {


    /**
     * @brief Generates a version declaration string
     * 
     * @param glVersion The GLSL version
     * @returns The version declaration string
     */
    static generateVersionDeclaration(glVersion: GLVersion) {
        switch (glVersion) {
            case 1:
                return "#version 100";
            case 2:
                return "#version 300";
        }
    }

}