import { ShaderUniform, ShaderAttribute, ShaderVarying } from "../types.js";
import { Shader, FragmentShader } from "./Shader.js";

// /**
//  * @class VertexShader
//  *
//  * @brief A vertex shader
//  */

// export class VertexShader extends Shader {

//     readonly uniforms: ShaderUniform[];
//     readonly attributes: ShaderAttribute[];
//     readonly varyings: ShaderVarying[];

//     /**
//      * @brief Creates a new VertexShader
//      *
//      * @param text The shader source code
//      * @param uniforms Array of uniforms used in the shader
//      * @param attributes Array of attributes used in the shader
//      * @param varyings Array of varyings used in the shader
//      */
//     constructor(text: string, uniforms: ShaderUniform[], attributes: ShaderAttribute[], varyings: ShaderVarying[]) {
//         super(text);
//         this.uniforms = uniforms;
//         this.attributes = attributes;
//         this.varyings = varyings;
//     }

//     isVertexShader(): this is VertexShader { return true; };
//     isFragmentShader(): this is FragmentShader { return false; };
// }
