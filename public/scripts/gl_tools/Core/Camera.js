/**
 * @file Camera.ts
 *
 * @brief Optional camera utilities that can be injected into a Scene.
 */
import { Matrix4 } from "../MatrixMath/Matrix.js";
import { Transform } from "../MatrixMath/Transform.js";
import { Vector3 } from "../MatrixMath/Vector.js";
export class GLCamera {
    constructor(width, height) {
        // View properties
        this._position = new Vector3(0, 0, 1);
        this._target = new Vector3(0, 0, 0);
        this._up = Vector3.NormalY;
        // Projection properties
        this._fov = Transform.degreesToRadians(60);
        this._near = 0.001;
        this._far = 1000;
        this._aspectRatio = width / height;
        this._viewMatrix = this.calculateView();
        this._projectionMatrix = this.calculateProjection();
    }
    get viewMatrix() { return this._viewMatrix; }
    ;
    get projectionMatrix() { return this._projectionMatrix; }
    ;
    get position() { return this._position; }
    ;
    move(movementVector) {
        this._position.add(movementVector, true);
        this._viewMatrix = this.calculateView();
    }
    lookAt(target, up = Vector3.NormalY) {
        this._target = target;
        this._up = up;
        this._viewMatrix = this.calculateView();
    }
    setFieldOfView(degrees) {
        this._fov = Transform.degreesToRadians(degrees);
        this._projectionMatrix = this.calculateProjection();
    }
    apply(program) {
        program.setUniformMat4("viewMatrix", this._viewMatrix);
        program.setUniformMat4("projectionMatrix", this._projectionMatrix);
    }
    calculateView() {
        return Matrix4.lookAt(this._position, this._target, this._up);
    }
    calculateProjection() {
        return Matrix4.perspectiveProjection(this._fov, this._aspectRatio, this._near, this._far);
    }
}
;
