import { BaseTexture } from "./Texture.js";
export class SolidColorTexture extends BaseTexture {
    constructor(color) {
        super();
        this._color = color;
    }
    apply(program) {
        program.setUniformBool("useTexture", false);
        program.setUniformBool("useVertexColor", false);
        program.setUniformVec4("objectColor", this._color);
    }
    pack(_) {
        return;
    }
    packedData() {
        return [];
    }
    destroy() {
        return;
    }
}
;
