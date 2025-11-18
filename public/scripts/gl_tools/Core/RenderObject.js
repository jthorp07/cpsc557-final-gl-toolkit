/**
 * @file RenderObject.ts
 *
 * @brief
 */
import { Matrix3, Matrix4 } from "../MatrixMath/Matrix.js";
import { Transform } from "../MatrixMath/Transform.js";
import { Vector3 } from "../MatrixMath/Vector.js";
const BASE_MODEL_MATRIX = new Matrix4().toIdentity();
const BASE_NORMAL_MATRIX = new Matrix3().toIdentity();
const ROTATION_PERIOD = Transform.degreesToRadians(360);
export class RenderObject {
    constructor(shape) {
        this._position = new Vector3(0.0, 0.0, 0.0);
        this._rotation = new Vector3(0.0, 0.0, 0.0);
        this._scale = new Vector3(1.0, 1.0, 1.0);
        this._modelMatrix = BASE_MODEL_MATRIX;
        this._normalMatrix = BASE_NORMAL_MATRIX;
        this._isModelDirty = false;
        this._isNormalDirty = false;
        this._shape = shape;
    }
    get shape() { return this._shape; }
    ;
    get modelMatrix() { return this._modelMatrix; }
    ;
    get normalMatrix() { return this._normalMatrix; }
    ;
    setPosition(setter) {
        this._position = setter(this._position);
        this._isModelDirty = true;
    }
    setRotation(setter) {
        this._rotation = setter(this._rotation);
        this._rotation.x = this._rotation.x % ROTATION_PERIOD;
        this._rotation.y = this._rotation.y % ROTATION_PERIOD;
        this._rotation.z = this._rotation.z % ROTATION_PERIOD;
        this._isModelDirty = true;
        this._isNormalDirty = true;
    }
    setScale(setter) {
        this._scale = setter(this._scale);
        this._isModelDirty = true;
        this._isNormalDirty = true;
    }
    updateModelMatrix() {
        if (!this._isModelDirty)
            return;
        this._modelMatrix = BASE_MODEL_MATRIX.multiply(Transform.translate(this._position))
            .multiply(Transform.rotate(this._rotation.x, "X"))
            .multiply(Transform.rotate(this._rotation.y, "Y"))
            .multiply(Transform.rotate(this._rotation.z, "Z"))
            .multiply(Transform.scale(this._scale));
        this._isModelDirty = false;
    }
    updateNormalMatrix() {
        if (!this._isNormalDirty)
            return;
        if (this._isModelDirty)
            this.updateModelMatrix();
        this._normalMatrix = this._modelMatrix.inverse().transpose().toMatrix3();
        this._isNormalDirty = false;
    }
    reset() {
        this._position = new Vector3(0.0, 0.0, 0.0);
        this._rotation = new Vector3(0.0, 0.0, 0.0);
        this._scale = new Vector3(1.0, 1.0, 1.0);
        this._modelMatrix = BASE_MODEL_MATRIX;
        this._normalMatrix = BASE_NORMAL_MATRIX;
    }
}
