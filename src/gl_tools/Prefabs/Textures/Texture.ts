/**
 * @file Texture.ts
 */

import { GLContext } from "../../GL/GLContext.js";
import { ShaderProgram } from "../../GL/ShaderProgram.js";

export abstract class BaseTexture {

    abstract apply(program: ShaderProgram): void;

    abstract pack(context: GLContext): void;

    abstract packedData(): [string, WebGLBuffer][];

    abstract destroy(): void;
};
