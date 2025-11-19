/**
 * @file AttributeGenerator.ts
 * 
 * @brief Codegen for attribute declarations
 */

import { GLVersion, ShaderAttribute } from "../../types.js";

/**
 * @class AttributeGenerator
 * 
 * @brief Generator for attribute declarations
 */
export class AttributeGenerator {

    /**
     * @brief Generates an attribute declaration string
     * 
     * @param attribute The attribute to generate
     * @param glVersion The GLSL version
     * @returns The attribute declaration string
     */
    static generateAttribute(attribute: ShaderAttribute, glVersion: GLVersion) {
        return `attribute ${attribute.type} ${attribute.name};`;
    }
};
