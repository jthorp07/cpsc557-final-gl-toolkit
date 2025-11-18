/**
 * @file VersionGenerator.ts
 * 
 * @brief Codegen for version declaration statements
 */

import { GLVersion } from "../../types.js";

export class VersionGenerator {

    static generateVersionDeclaration(glVersion: GLVersion) {
        switch (glVersion) {
            case 1:
                return "#version 100";
            case 2:
                return "#version 300";
        }
    }
}