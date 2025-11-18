/**
 * @file Scene.ts
 *
 * @brief Defines the Scene class, which is a collection of WebGL programs
 *        and supporting data that is ready to be rendered in a render loop.
 */
import { Vector3 } from "../MatrixMath/Vector.js";
import { assert, assertNotUndefined } from "./Assert.js";
import { GLCamera } from "./Camera.js";
import { GLLight } from "./Light.js";
import { RenderObject } from "./RenderObject.js";
/**
 * @brief Employs a template method to enable subclasses to define objects
 *        and animations for a render loop.
 */
export class Scene {
    constructor() {
        this._context = undefined;
        this._program = undefined;
        this._lastRenderTime = 0;
        this._ready = false;
        this._shapes = new Map();
        this._objects = new Map();
        this._camera = undefined;
        this._light = new GLLight(new Vector3(3, 3, 3));
    }
    set context(context) {
        this._context = context;
        const [width, height] = context.dimensions();
        this._camera = new GLCamera(width, height);
    }
    /**
     * @brief Renders a frame of this scene
     *
     * @param time Time the animation request dispatched
     */
    renderFrame(time) {
        const now = time || performance.now();
        const delta = (this._lastRenderTime === 0) ? 0 : (now - this._lastRenderTime) / 1000;
        console.log(`Scene: Delta = ${delta}`);
        this._lastRenderTime = now;
        assert(this._ready, "Scene does not appear to have called init() before rendering");
        this.update(delta);
        this._context.clear();
        this.renderObjects();
    }
    /**
     * @brief Cleans up this scene's resources
     */
    dispose() {
        this._ready = false;
        this.cleanup();
    }
    /**
     * @brief Calls `this.init()` and sets this as ready to render
     */
    initialize(context) {
        // Pre-Init: Ensure context/version match
        if (context)
            this._context = context;
        assertNotUndefined(this._context);
        const [width, height] = context.dimensions();
        this._camera = new GLCamera(width, height);
        assert((!this.requiredWebGLVersion()) || (this.requiredWebGLVersion() === this._context.version()), `Incompatible WebGL Context: This scene requires WebGL ${this.requiredWebGLVersion()}`);
        this.init(this._context);
        // Post-Init: Generate and compile shaders
        this._program = this._context.makeGenericShaderProgram();
        this._program.use();
        this.packObjects();
        this._ready = true;
    }
    /**
     * @brief Adds a shape to the registered shapes this scene manages
     *
     * @param name Unique name for this shape in the scene
     * @param shape Shape instance to initialize the shape to
     * @param allowOverwrite If false, will throw when registering a shape to a name that already has a shape
     */
    registerShape(name, shape, allowOverwrite = false) {
        if (allowOverwrite) {
            shape.pack(this._context);
            this._shapes.set(name, shape);
        }
        else {
            if (this._shapes.has(name))
                throw new Error(`This scene already has a shape named ${name}`);
            this._shapes.set(name, shape);
        }
    }
    /**
     * @brief Allows modification of this scene's shapes via callback.
     *        Repacks target shape afterpassing it to the passed callback
     *
     * @param name Name of the shape as it was registered in the scene
     * @param callback Function to accept and modify target shape
     */
    withShape(name, callback) {
        if (!this._shapes.has(name))
            throw new Error(`No shape with name ${name}`);
        const target = this._shapes.get(name);
        callback(target);
        target.pack(this._context);
    }
    /**
     * @brief Adds a render object to the registered render objects this scene manages
     *
     * @param name Unique name for this render object in the scene
     * @param shapeName Unique name of the base shape to use to instantiate the object
     * @param allowOverwrite If false, will throw when registering an object to a name that already has an object
     */
    instantiateObject(name, shapeName, allowOverwrite = false) {
        if (!this._shapes.has(shapeName))
            throw new Error(`No shape with name ${name}`);
        const shape = this._shapes.get(shapeName);
        assertNotUndefined(shape);
        const object = new RenderObject(shape);
        if (allowOverwrite) {
            this._objects.set(name, object);
        }
        else {
            if (this._objects.has(name))
                throw new Error(`This scene already has a object named ${name}`);
            this._objects.set(name, object);
        }
    }
    /**
     * @brief Allows modification of this scene's render objects via callback
     *
     * @param name Name of the object as it was registered in the scene
     * @param callback Function to accept and modify target object
     */
    withObject(name, callback) {
        if (!this._objects.has(name))
            throw new Error(`No object with name ${name}`);
        const target = this._objects.get(name);
        callback(target);
    }
    /**
     * @brief Allows modification of this scene's camera via callback
     *
     * @param callback Function to accept and modify the camera
     */
    withCamera(callback) {
        callback(this._camera);
    }
    renderObjects() {
        // Set camera uniforms
        this._program.setUniformMat4("viewMatrix", this._camera.viewMatrix);
        this._program.setUniformMat4("projectionMatrix", this._camera.projectionMatrix);
        // Set light uniforms
        this._program.setUniformVec3("lightPosition", this._light.position);
        this._program.setUniformVec3("lightColor", this._light.color);
        // For each object, bind, set uniforms, and draw
        this._objects.forEach((object) => {
            object.updateModelMatrix();
            object.updateNormalMatrix();
            this._program.bind(object.shape);
            this._program.setUniformMat4("modelMatrix", object.modelMatrix);
            this._program.setUniformMat3("normalMatrix", object.normalMatrix);
            this._context.drawObject(object);
        });
    }
    packObjects() {
        this._objects.forEach(object => object.shape.pack(this._context));
    }
}
