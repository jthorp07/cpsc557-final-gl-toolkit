/**
 * @file AttributeGenerator.ts
 *
 * @brief Codegen for attribute declarations
 */
export class AttributeGenerator {
    static generateAttribute(attribute, glVersion) {
        return `attribute ${attribute.type} ${attribute.name};`;
    }
}
;
