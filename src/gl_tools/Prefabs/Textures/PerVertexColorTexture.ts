import { GLContext } from "../../GL/GLContext.js";
import { ShaderProgram } from "../../GL/ShaderProgram.js";
import { PackedGLBuffer } from "../../GL/types.js";
import { GLColor } from "./Color.js";
import { BaseTexture } from "./Texture.js";

export class PerVertexColorTexture extends BaseTexture {

    private readonly _colors: GLColor[];
    private readonly _specularity: number;
    private _packedColors: PackedGLBuffer | undefined;

    constructor(colors: GLColor[], specularity: number) {
        super();
        this._colors = colors;
        this._specularity = specularity;
    }

    apply(program: ShaderProgram): void {
        program.setUniformBool("userVertexColor", true);
        program.setUniformBool("useTexture", false);
    }
    pack(context: GLContext): void {
        if (this._packedColors) {
            this._packedColors.destroy();
            this._packedColors = undefined;
        }
        this._packedColors = context.packData(this._colors);
    }

    packedData(): [string, WebGLBuffer][] {
        if (!this._packedColors) throw new Error("This texture has not been packed, or has been invalidated since its last packing");
        return [["vertexColor", this._packedColors.buffer]];
    }

    destroy(): void {
        if (this._packedColors) this._packedColors.destroy();
        this._packedColors = undefined;
    }
};
