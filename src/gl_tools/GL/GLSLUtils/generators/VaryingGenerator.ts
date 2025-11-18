/**
 * @file VaryingGenerator.ts
 * 
 * @brief Codegen for varying (vertex out, fragment in) parameter declarations
 */

import { ShaderVarying } from "../../types.js";

export class VaryingGenerator {

    static generateVarying(varying: ShaderVarying, glVersion: 1 | 2 = 1) {
        if (glVersion == 1) {
            return `varying ${varying.type} ${varying.name};`;
        }
        return `${varying.direction} ${varying.type} ${varying.name};`;
    }
};
