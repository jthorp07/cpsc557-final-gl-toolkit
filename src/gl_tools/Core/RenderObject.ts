/**
 * @file RenderObject.ts
 * 
 * @brief Represents an object to be rendered in the scene
 */

import { Matrix3, Matrix4 } from "../MatrixMath/Matrix.js";
import { Transform } from "../MatrixMath/Transform.js";
import { Vector3 } from "../MatrixMath/Vector.js";
import { BaseShape } from "../Prefabs/index.js";

const BASE_MODEL_MATRIX = new Matrix4().toIdentity();
const BASE_NORMAL_MATRIX = new Matrix3().toIdentity();

const ROTATION_PERIOD = Transform.degreesToRadians(360);

/**
 * @class RenderObject
 * 
 * @brief Encapsulates a shape and its transformation state
 */
export class RenderObject {

    protected readonly _shape: BaseShape;
    protected _position: Vector3 = new Vector3(0.0, 0.0, 0.0);
    protected _rotation: Vector3 = new Vector3(0.0, 0.0, 0.0);
    protected _scale: Vector3 = new Vector3(1.0, 1.0, 1.0);
    protected _modelMatrix: Matrix4 = BASE_MODEL_MATRIX;
    protected _normalMatrix: Matrix3 = BASE_NORMAL_MATRIX;
    protected _isModelDirty: boolean = false;
    protected _isNormalDirty: boolean = false;

    /**
     * @brief Creates a new RenderObject
     * 
     * @param shape The base shape of this object
     */
    constructor(shape: BaseShape) {
        this._shape = shape;
    }

    /**
     * @brief Gets the shape associated with this object
     */
    get shape() { return this._shape; };
    /**
     * @brief Gets the current model matrix
     */
    get modelMatrix() { return this._modelMatrix; };
    /**
     * @brief Gets the current normal matrix
     */
    get normalMatrix() { return this._normalMatrix; };

    /**
     * @brief Sets the position of the object
     * 
     * @param setter Function that takes the old position and returns the new position
     */
    setPosition(setter: (oldPosition: Vector3) => Vector3) {
        this._position = setter(this._position);
        this._isModelDirty = true;
    }

    /**
     * @brief Sets the rotation of the object
     * 
     * @param setter Function that takes the old rotation and returns the new rotation
     */
    setRotation(setter: (oldRotation: Vector3) => Vector3) {
        this._rotation = setter(this._rotation);
        this._rotation.x = this._rotation.x % ROTATION_PERIOD;
        this._rotation.y = this._rotation.y % ROTATION_PERIOD;
        this._rotation.z = this._rotation.z % ROTATION_PERIOD;
        this._isModelDirty = true;
        this._isNormalDirty = true;
    }

    /**
     * @brief Sets the scale of the object
     * 
     * @param setter Function that takes the old scale and returns the new scale
     */
    setScale(setter: (oldScale: Vector3) => Vector3) {
        this._scale = setter(this._scale);
        this._isModelDirty = true;
        this._isNormalDirty = true;
    }

    /**
     * @brief Updates the model matrix based on current position, rotation, and scale
     */
    updateModelMatrix() {
        if (!this._isModelDirty) return;
        this._modelMatrix = BASE_MODEL_MATRIX.multiply(Transform.translate(this._position))
            .multiply(Transform.rotate(this._rotation.x, "X"))
            .multiply(Transform.rotate(this._rotation.y, "Y"))
            .multiply(Transform.rotate(this._rotation.z, "Z"))
            .multiply(Transform.scale(this._scale));
        this._isModelDirty = false;
    }

    /**
     * @brief Updates the normal matrix based on the model matrix
     */
    updateNormalMatrix() {
        if (!this._isNormalDirty) return;
        if (this._isModelDirty) this.updateModelMatrix();
        this._normalMatrix = this._modelMatrix.inverse().transpose().toMatrix3();
        this._isNormalDirty = false;
    }

    /**
     * @brief Resets the object's transformation to identity
     */
    reset() {
        this._position = new Vector3(0.0, 0.0, 0.0);
        this._rotation = new Vector3(0.0, 0.0, 0.0);
        this._scale = new Vector3(1.0, 1.0, 1.0);
        this._modelMatrix = BASE_MODEL_MATRIX;
        this._normalMatrix = BASE_NORMAL_MATRIX;
    }

}
