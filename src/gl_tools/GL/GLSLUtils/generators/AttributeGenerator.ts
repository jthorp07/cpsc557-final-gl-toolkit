/**
 * @file AttributeGenerator.ts
 * 
 * @brief Codegen for attribute declarations
 */

import { GLVersion, ShaderAttribute } from "../../types.js";

export class AttributeGenerator {

    static generateAttribute(attribute: ShaderAttribute, glVersion: GLVersion) {
        return `attribute ${attribute.type} ${attribute.name};`;
    }
};
