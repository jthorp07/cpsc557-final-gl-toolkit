/**
 * @file ShaderProgram
 * 
 * @brief A minimal wrapper around a WebGLProgram to reduce scaffold duplication
 *        and with basic error handling.
 */

import { assertNotNull } from "../../Core/Assert.js";
import { Matrix3, Matrix4 } from "../../MatrixMath/Matrix.js";
import { Vector2, Vector3, Vector4 } from "../../MatrixMath/Vector.js";
import { BaseShape } from "../../Prefabs/index.js";
import { GLSLType } from "../GLSLUtils/language/GLSLTypes.js";
import { FragmentShader, VertexShader } from "../Shaders/Shader.js";

type AttributePointerData = {
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
}
type AttributePointerGetter = (context: WebGLRenderingContext | WebGL2RenderingContext) => AttributePointerData;

const ATTRIBUTE_POINTER_MAPPINGS = new Map<GLSLType, AttributePointerGetter>([
    ["float", (context) => {
        return {
            size: 1,
            type: context.FLOAT,
            normalized: false,
            stride: 0,
            offset: 0
        };
    }],
    ["vec2", (context) => {
        return {
            size: 2,
            type: context.FLOAT,
            normalized: false,
            stride: 0,
            offset: 0
        };
    }],
    ["vec3", (context) => {
        return {
            size: 3,
            type: context.FLOAT,
            normalized: false,
            stride: 0,
            offset: 0
        };
    }],
    ["vec4", (context) => {
        return {
            size: 4,
            type: context.FLOAT,
            normalized: false,
            stride: 0,
            offset: 0
        };
    }],
])

export class ShaderProgram {

    // WebGL Data
    protected readonly context: WebGLRenderingContext | WebGL2RenderingContext;
    protected readonly program: WebGLProgram;
    protected uniformMap = new Map<string, [WebGLUniformLocation, GLSLType]>();
    protected vertexAttributes = new Map<string, [number, GLSLType]>();

    private _vertexShaderUrl: string;
    private _fragmentShaderUrl: string;

    constructor(
        context: WebGLRenderingContext | WebGL2RenderingContext,
        vertexShader: VertexShader,
        fragmentShader: FragmentShader
    ) {

        // Create and link shader program
        this.context = context;
        this.program = this.linkProgram(
            this.compileShader(context.VERTEX_SHADER, vertexShader.text),
            this.compileShader(context.FRAGMENT_SHADER, fragmentShader.text)
        );
        this.use();
        this._vertexShaderUrl = vertexShader.toURL();
        this._fragmentShaderUrl = fragmentShader.toURL();

        // Create mappings for vertex attributes
        vertexShader.attributes.map((attribute) => {
            const attributeLocation = this.context.getAttribLocation(this.program, attribute.name);
            this.vertexAttributes.set(attribute.name, [attributeLocation, attribute.type]);
        });

        // Create mappings for shader uniforms
        const allUniforms = vertexShader.uniforms.concat(fragmentShader.uniforms);
        allUniforms.map((uniform) => {
            const uniformLocation = this.context.getUniformLocation(this.program, uniform.name);
            assertNotNull(uniformLocation);
            this.uniformMap.set(uniform.name, [uniformLocation, uniform.type]);
        })

    }

    /** @brief Returns the URL of the vertex shader source */
    get vertexShaderUrl() { return this._vertexShaderUrl; };
    /** @brief Returns the URL of the fragment shader source */
    get fragmentShaderUrl() { return this._fragmentShaderUrl; };

    /**
     * @brief Adds the underlying program to the underlying context's current rendering
     *        state.
     */
    use() {
        this.context.useProgram(this.program);
    }

    /**
     * @brief Binds a shape's topology and texture buffers to the program
     *        so its instantiations can be drawn
     * 
     * @param shape Shape to bind
     */
    bind(shape: BaseShape) {

        // Bind shape topology
        const packedTopology = shape.packedTopology();
        const enabledAttributes = new Set<string>();
        this.bindAttribute(packedTopology.vertexBuffer, "vertexPosition", enabledAttributes);
        this.bindAttribute(packedTopology.normalBuffer, "vertexNormal", enabledAttributes);
        this.bindAttribute(packedTopology.textureCoordinateBuffer, "textureCoordinate", enabledAttributes);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, packedTopology.indexBuffer);

        // Bind texture data if needed
        const packedTextureData = shape.packedTexture();
        for (const [target, buffer] of packedTextureData) {
            this.bindAttribute(buffer, target, enabledAttributes);
        }
    }

    private bindAttribute(buffer: WebGLBuffer, name: string, enabledAttributes: Set<string>) {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
        const [location, glType] = this.vertexAttributes.get(name);
        const pointerData = (ATTRIBUTE_POINTER_MAPPINGS.get(glType))(this.context);
        this.context.vertexAttribPointer(
            location,
            pointerData.size,
            pointerData.type,
            pointerData.normalized,
            pointerData.stride,
            pointerData.offset
        );
        this.context.enableVertexAttribArray(location);
    }

    /**
     * @brief Sets a boolean uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformBool(name: string, data: boolean) {

        const uniformLocation = this.getUniform(name, "bool");
        this.context.uniform1i(uniformLocation, data ? 1 : 0);
    }

    /**
     * @brief Sets a float uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformFloat(name: string, data: number) {

        const uniformLocation = this.getUniform(name, "float");
        this.context.uniform1f(uniformLocation, data);
    }

    /**
     * @brief Sets a vec2 uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformVec2(name: string, data: Vector2) {

        const uniformLocation = this.getUniform(name, "vec2");
        this.context.uniform2fv(uniformLocation, data);
    }

    /**
     * @brief Sets a vec3 uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformVec3(name: string, data: Vector3) {

        const uniformLocation = this.getUniform(name, "vec3");
        this.context.uniform3fv(uniformLocation, data);
    }

    /**
     * @brief Sets a vec4 uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformVec4(name: string, data: Vector4) {

        const uniformLocation = this.getUniform(name, "vec4");
        this.context.uniform4fv(uniformLocation, data);
    }

    /**
     * @brief Sets a mat2 uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformMat2(name: string, data: Vector2[]) {
        throw new Error("Not implemented");
    }

    /**
     * @brief Sets a mat3 uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformMat3(name: string, data: Matrix3) {

        const uniformLocation = this.getUniform(name, "mat3");
        this.context.uniformMatrix3fv(uniformLocation, false, data);
    }

    /**
     * @brief Sets a mat4 uniform
     * 
     * @param name Name of the uniform
     * @param data Value to set
     */
    setUniformMat4(name: string, data: Matrix4) {

        const uniformLocation = this.getUniform(name, "mat4");
        this.context.uniformMatrix4fv(uniformLocation, false, data);
    }

    /**
     * @brief Gets the location of a uniform
     * 
     * @param name Name of the uniform
     * @param type Expected type of the uniform
     * @returns The WebGLUniformLocation
     */
    protected getUniform(name: string, type: GLSLType) {
        if (!this.uniformMap.has(name)) throw new Error(`${name} is not a uniform for this shader program`);
        const [loc, glType] = this.uniformMap.get(name);
        if (glType !== type) throw new Error(`${name} is not of type ${type}`);

        return loc;
    }

    /**
     * @brief Compiles text to a WebGLShader. Throws on error
     * 
     * @param type Type of shader to create
     * @param shaderText Literal text of the shader to compile
     * @returns Compiled WebGLShader
     */
    private compileShader(type: number, shaderText: string) {
        const shader = this.context.createShader(type);
        assertNotNull(shader);
        this.context.shaderSource(shader, shaderText);
        this.context.compileShader(shader);
        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            const shaderLog = this.context.getShaderInfoLog(shader) || "No Log Available";
            alert(`Shader failed to compile:\n\n${shaderLog}`);
            throw new Error("Failed to Compile Shader");
        }
        return shader;
    }

    /**
     * @brief Makes a WebGLProgram and links the given shaders to it. Throws
     *        on error
     * 
     * @param vertexShader Compiled vertex shader to link
     * @param fragmentShader Compiled fragment shader to link
     * @returns WebGLProgram with shaders linked
     */
    private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = this.context.createProgram();
        assertNotNull(program);
        this.context.attachShader(program, vertexShader);
        this.context.attachShader(program, fragmentShader);
        this.context.linkProgram(program);
        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            const programLog = this.context.getProgramInfoLog(program) || "No Log Available";
            alert(`Program failed to link:\n\n${programLog}`);
            throw new Error("Failed to Link Program");
        }
        return program;
    }
}
