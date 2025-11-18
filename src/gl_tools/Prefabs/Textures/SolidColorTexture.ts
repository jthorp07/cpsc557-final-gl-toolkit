import { BaseTexture } from "./Texture.js";
import { GLColor } from "./Color.js";
import { ShaderProgram } from "../../GL/ShaderProgram.js";
import { GLContext } from "../../GL/GLContext.js";

export class SolidColorTexture extends BaseTexture {

    private readonly _color: GLColor;

    constructor(color: GLColor) {
        super();
        this._color = color;
    }

    apply(program: ShaderProgram) {
        program.setUniformBool("useTexture", false);
        program.setUniformBool("useVertexColor", false);
        program.setUniformVec4("objectColor", this._color);
    }

    pack(_: GLContext): void {
        return;
    }

    packedData(): [string, WebGLBuffer][] {
        return [];
    }

    destroy(): void {
        return;
    }
};
