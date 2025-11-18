/**
 * @file ShaderProgram
 *
 * @brief A minimal wrapper around a WebGLProgram to reduce scaffold duplication
 *        and with basic error handling.
 */
import { assertNotNull } from "../Core/Assert.js";
const ATTRIBUTE_POINTER_MAPPINGS = new Map([
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
]);
export class ShaderProgram {
    constructor(context, vertexShader, fragmentShader) {
        this.uniforms = new Map();
        this.vertexAttributes = new Map();
        // Create and link shader program
        this.context = context;
        this.program = this.linkProgram(this.compileShader(context.VERTEX_SHADER, vertexShader.text), this.compileShader(context.FRAGMENT_SHADER, fragmentShader.text));
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
            this.uniforms.set(uniform.name, [uniformLocation, uniform.type]);
        });
    }
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
    bind(shape) {
        // Bind shape topology
        const packedTopology = shape.packedTopology();
        const enabledAttributes = new Set();
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
    bindAttribute(buffer, name, enabledAttributes) {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
        const [location, glType] = this.vertexAttributes.get(name);
        const pointerData = (ATTRIBUTE_POINTER_MAPPINGS.get(glType))(this.context);
        this.context.vertexAttribPointer(location, pointerData.size, pointerData.type, pointerData.normalized, pointerData.stride, pointerData.offset);
        this.context.enableVertexAttribArray(location);
    }
    setUniformBool(name, data) {
        const uniformLocation = this.getUniform(name, "bool");
        this.context.uniform1i(uniformLocation, data ? 1 : 0);
    }
    setUniformFloat(name, data) {
        const uniformLocation = this.getUniform(name, "float");
        this.context.uniform1f(uniformLocation, data);
    }
    setUniformVec2(name, data) {
        const uniformLocation = this.getUniform(name, "vec2");
        this.context.uniform2fv(uniformLocation, data);
    }
    setUniformVec3(name, data) {
        const uniformLocation = this.getUniform(name, "vec3");
        this.context.uniform3fv(uniformLocation, data);
    }
    setUniformVec4(name, data) {
        const uniformLocation = this.getUniform(name, "vec4");
        this.context.uniform4fv(uniformLocation, data);
    }
    setUniformMat2(name, data) {
        throw new Error("Not implemented");
    }
    setUniformMat3(name, data) {
        const uniformLocation = this.getUniform(name, "mat3");
        this.context.uniformMatrix3fv(uniformLocation, false, data);
    }
    setUniformMat4(name, data) {
        const uniformLocation = this.getUniform(name, "mat4");
        this.context.uniformMatrix4fv(uniformLocation, false, data);
    }
    getUniform(name, type) {
        if (!this.uniforms.has(name))
            throw new Error(`${name} is not a uniform for this shader program`);
        const [loc, glType] = this.uniforms.get(name);
        if (glType !== type)
            throw new Error(`${name} is not of type ${type}`);
        return loc;
    }
    /**
     * @brief Compiles text to a WebGLShader. Throws on error.
     *
     * @param type Type of shader to create
     * @param shaderText Literal text of the shader to compile
     * @returns Compiled WebGLShader
     */
    compileShader(type, shaderText) {
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
     *        on error.
     *
     * @param vertexShader Compiled vertex shader to link
     * @param fragmentShader Compiled fragment shader to link
     * @returns WebGLProgram with shaders linked
     */
    linkProgram(vertexShader, fragmentShader) {
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
