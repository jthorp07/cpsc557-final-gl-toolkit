/**
 * @file types.ts
 * 
 * @brief Internal types that either map to WebGL types or group coupled WebGL data
 */

import { GLSLType } from "./GLSLUtils/language/GLSLTypes.js";

/**
 * @brief Valid WebGL versions
 */
export type GLVersion = 1 | 2;

/**
 * @brief WebGL buffers that represent a renderable object. Includes
 *        a destroy() property to clean up the buffers
 */
export type PackedGLShape = {
    vertexBuffer: WebGLBuffer;
    normalBuffer: WebGLBuffer;
    textureCoordinateBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    indexType: number;
    indexCount: number;
    destroy: () => void;
};

/**
 * @brief A WebGLBuffer and function to clean it up
 */
export type PackedGLBuffer = {
    buffer: WebGLBuffer,
    destroy: () => void;
};

/**
 * @brief Precision declaration keywords
 */
export type PrecisionLevel = "lowp" | "mediump" | "highp";

export type PrecisionDeclaration = {
    precision: PrecisionLevel;
    target: GLSLType;
};

export type ShaderAttribute = {
    name: string;
    type: GLSLType;
};

export type ShaderUniform = {
    name: string;
    type: GLSLType;
};

export type ShaderVarying = {
    direction: "in" | "out";
    name: string;
    type: GLSLType;
};
