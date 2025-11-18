/**
 * @file VersionGenerator.ts
 *
 * @brief Codegen for version declaration statements
 */
export class VersionGenerator {
    static generateVersionDeclaration(glVersion) {
        switch (glVersion) {
            case 1:
                return "#version 100";
            case 2:
                return "#version 300";
        }
    }
}
