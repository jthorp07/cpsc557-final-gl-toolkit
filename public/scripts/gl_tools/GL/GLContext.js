/**
 * @file GLContext.ts
 *
 * @brief Source file for the GLContext class
 */
import { assertNotNull, ShaderProgram, flattenVectors } from "../index.js";
import { makeGenericFragmentShader } from "./GLSLUtils/templates/GenericFragmentShader.js";
import { makeGenericVertexShader } from "./GLSLUtils/templates/GenericVertexShader.js";
const DEFAULT_OPTIONS = { version: undefined };
const MAX_UNSIGNED_BYTE = 256;
const MAX_UNSIGNED_SHORT = 65536;
/**
 * @brief Constructs a rendering context for WebGL from a HTML canvas element
 *
 * @param canvas HTML canvas to render WebGL to
 * @param options Options for `canvas.getContext`
 * @returns A WebGL rendering context on success, otherwise undefined
 */
function getContextUseLatest(canvas, options) {
    let context = canvas.getContext("webgl2");
    if (context)
        return context;
    context = canvas.getContext("webgl", options);
    if (context)
        return context;
    return undefined;
}
/**
 * @brief Constructs a rendering context for WebGL from a HTML canvas element
 *
 * @param canvas HTML canvas to render WebGL to
 * @param options Options for `canvas.getContext`
 * @returns A WebGL rendering context on success, otherwise undefined
 */
function getContextFailNotLatest(canvas, options) {
    let context = canvas.getContext("webgl2", options);
    if (context)
        return context;
    return undefined;
}
/**
 * @brief Constructs a rendering context for WebGL from a HTML canvas element
 *
 * @param canvas HTML canvas to render WebGL to
 * @param options Options for `canvas.getContext`
 * @returns A WebGL rendering context on success, otherwise undefined
 */
function getContextForceVOne(canvas, options) {
    let context = canvas.getContext("webgl", options);
    if (context)
        return context;
    return undefined;
}
/**
 * @brief Wrapper around WebGL rendering contexts
 */
export class GLContext {
    /**
     * @brief Contructs a WebGLRenderingContext from the given canvas
     *
     * @param canvas HTML canvas to render WebGL to
     * @param options Optional attributes to pass to `HTMLCanvasElement.getContext`
     * @returns Rendering context for the canvas
     *
     * @note This method directly returns a rendering context and not an instance
     *       of the GLContext wrapper class
     */
    static makeWebGLContext(canvas, options) {
        let context = canvas.getContext("webgl", options);
        if (context)
            return context;
        alert("Unable to get WebGL");
        return;
    }
    /**
     * @brief Constructs a rendering context
     *
     * @param canvas HTML canvas to render WebGL to
     * @param options Additional options for initialization
     * @param webGLOptions Optional attributes to pass to `HTMLCanvasElement.getContext`
     */
    static initializeWithContext(canvas, options = DEFAULT_OPTIONS, webGLOptions) {
        switch (options.version) {
            case undefined:
                const latestContext = getContextUseLatest(canvas, webGLOptions);
                if (latestContext)
                    return new GLContext(latestContext);
                alert("Unable to get WebGL");
                return;
            case 2:
                const gl2Context = getContextFailNotLatest(canvas, webGLOptions);
                if (gl2Context)
                    return new GLContext(gl2Context);
                alert("Unable to get WebGL2");
                return;
            case 1:
                const glContext = getContextForceVOne(canvas, webGLOptions);
                if (glContext)
                    return new GLContext(glContext);
                alert("Unable to get WebGL");
                return;
        }
    }
    constructor(context) {
        this.context = context;
        this._version = (context instanceof WebGL2RenderingContext) ? 2 : 1;
    }
    /**
     * @brief Predicate to determine if this instance is capable of WebGL2
     *        functionality.
     *
     * @returns True if this can use WebGL2 functionality, otherwise false
     */
    version() {
        return this._version;
    }
    /**
     * @brief Retrieves the width and height of this context's canvas
     */
    dimensions() {
        return [this.context.canvas.width, this.context.canvas.height];
    }
    /**
     * @brief Uses this context to make a generalized model-view-projection
     *        shader program capable of accepting and rendering simple shapes
     *        without needing to add WebGL-specific functionality
     *
     * @returns A compiled shader program capable of handling most simple scenes
     */
    makeGenericShaderProgram() {
        try {
            const vertexShader = makeGenericVertexShader(this._version);
            console.log(`Vertex Shader:\n\n${vertexShader.text}\n\n`);
            if (!vertexShader.isVertexShader())
                throw new Error("vertexShader is not a vertex shader");
            const fragmentShader = makeGenericFragmentShader(this._version);
            console.log(`Fragment Shader:\n\n${fragmentShader.text}\n\n`);
            if (!fragmentShader.isFragmentShader())
                throw new Error("fragmentShader is not a fragment shader");
            const program = new ShaderProgram(this.context, vertexShader, fragmentShader);
            return program;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(`Unable to create shader program. Underlying error message: "${err.message}"`);
            }
        }
    }
    /**
     * @brief Uses this context to make a shader program using the given shaders
     *
     * @param vertexShader Vertex shader text
     * @param fragmentShader Fragment shader text
     * @returns New instance of ShaderProgram using this context and the given shaders
     */
    makeShaderProgram(vertexShader, fragmentShader) {
        try {
            const program = new ShaderProgram(this.context, vertexShader, fragmentShader);
            return program;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(`Unable to create shader program. Underlying error message: "${err.message}"`);
            }
        }
    }
    /**
     * @brief Packs a shape into WebGL buffers using this context.
     *
     * @param shape Shape to pack
     */
    packShape(shape) {
        // Pack vertex buffer
        const vertexBuffer = this.context.createBuffer();
        assertNotNull(vertexBuffer);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, flattenVectors(shape.vertices()), this.context.STATIC_DRAW);
        // Pack normal buffer
        const normalBuffer = this.context.createBuffer();
        assertNotNull(normalBuffer);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, normalBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, flattenVectors(shape.normals()), this.context.STATIC_DRAW);
        // Pack texture coordinates
        const textureCoordinateBuffer = this.context.createBuffer();
        assertNotNull(textureCoordinateBuffer);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, textureCoordinateBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, flattenVectors(shape.textureCoordinates()), this.context.STATIC_DRAW);
        // Determine index buffer type and validity
        const indices = shape.relativeIndices();
        const maxIndex = Math.max(...indices);
        let indexArray = null;
        let indexType = null;
        if (maxIndex < MAX_UNSIGNED_BYTE) {
            indexArray = new Uint8Array(indices);
            indexType = this.context.UNSIGNED_BYTE;
        }
        else if (maxIndex < MAX_UNSIGNED_SHORT) {
            indexArray = new Uint16Array(indices);
            indexType = this.context.UNSIGNED_SHORT;
        }
        else if (this._version) {
            indexArray = new Uint32Array(indices);
            indexType = this.context.UNSIGNED_INT;
        }
        else {
            throw new Error(`Failed to pack shape: Index range exceeds ${MAX_UNSIGNED_SHORT} (Received max ${maxIndex})`);
        }
        // Pack index buffer
        const indexBuffer = this.context.createBuffer();
        assertNotNull(indexBuffer);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, indexArray, this.context.STATIC_DRAW);
        return {
            vertexBuffer: vertexBuffer,
            normalBuffer: normalBuffer,
            textureCoordinateBuffer: textureCoordinateBuffer,
            indexBuffer: indexBuffer,
            indexType: indexType,
            indexCount: shape.vertexCount(),
            destroy: () => {
                this.context.deleteBuffer(vertexBuffer);
                this.context.deleteBuffer(normalBuffer);
                this.context.deleteBuffer(textureCoordinateBuffer);
                this.context.deleteBuffer(indexBuffer);
            }
        };
    }
    packData(data) {
        // Pack buffer
        const buffer = this.context.createBuffer();
        assertNotNull(buffer);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, flattenVectors(data), this.context.STATIC_DRAW);
        return {
            buffer: buffer,
            destroy: () => { this.context.deleteBuffer(buffer); }
        };
    }
    drawObject(object) {
        console.log("GLContext: Draw Object");
        const topology = object.shape.packedTopology();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, topology.vertexBuffer);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, topology.indexBuffer);
        this.context.drawElements(this.context.TRIANGLES, topology.indexCount, topology.indexType, 0);
    }
    clear() {
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }
}
