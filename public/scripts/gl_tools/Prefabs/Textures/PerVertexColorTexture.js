import { BaseTexture } from "./Texture.js";
export class PerVertexColorTexture extends BaseTexture {
    constructor(colors, specularity) {
        super();
        this._colors = colors;
        this._specularity = specularity;
    }
    apply(program) {
        program.setUniformBool("userVertexColor", true);
        program.setUniformBool("useTexture", false);
    }
    pack(context) {
        if (this._packedColors) {
            this._packedColors.destroy();
            this._packedColors = undefined;
        }
        this._packedColors = context.packData(this._colors);
    }
    packedData() {
        if (!this._packedColors)
            throw new Error("This texture has not been packed, or has been invalidated since its last packing");
        return [["vertexColor", this._packedColors.buffer]];
    }
    destroy() {
        if (this._packedColors)
            this._packedColors.destroy();
        this._packedColors = undefined;
    }
}
;
