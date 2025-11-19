/**
 * @file Camera.ts
 * 
 * @brief Optional camera utilities that can be injected into a Scene.
 */

import { ShaderProgram } from "../GL/ShaderProgram.js";
import { Matrix4 } from "../MatrixMath/Matrix.js";
import { Transform } from "../MatrixMath/Transform.js";
import { Vector3 } from "../MatrixMath/Vector.js";

export class GLCamera {

    // View properties
    private _position: Vector3 = new Vector3(0, 0, 1);
    private _target: Vector3 = new Vector3(0, 0, 0);
    private _up: Vector3 = Vector3.NormalY;

    // Projection properties
    private _fov: number = Transform.degreesToRadians(60);
    private _aspectRatio: number;
    private _near: number = 0.001;
    private _far: number = 1000;

    // Component Matrices
    private _viewMatrix: Matrix4;
    private _projectionMatrix: Matrix4;

    constructor(width: number, height: number) {
        this._aspectRatio = width / height;
        this._viewMatrix = this.calculateView();
        this._projectionMatrix = this.calculateProjection();
    }

    get viewMatrix() { return this._viewMatrix; };
    get projectionMatrix() { return this._projectionMatrix; };
    get position() { return this._position; };

    move(movementVector: Vector3) {
        this._position.add(movementVector, true);
        this._viewMatrix = this.calculateView();
    }

    lookAt(target: Vector3, up: Vector3 = Vector3.NormalY) {
        this._target = target;
        this._up = up;
        this._viewMatrix = this.calculateView();
    }

    setFieldOfView(degrees: number) {
        this._fov = Transform.degreesToRadians(degrees);
        this._projectionMatrix = this.calculateProjection();
    }

    apply(program: ShaderProgram) {
        program.setUniformMat4("viewMatrix", this._viewMatrix);
        program.setUniformMat4("projectionMatrix", this._projectionMatrix);
    }

    private calculateView() {
        return Matrix4.lookAt(
            this._position,
            this._target,
            this._up
        );
    }

    private calculateProjection() {
        return Matrix4.perspectiveProjection(this._fov, this._aspectRatio, this._near, this._far);
    }
};
