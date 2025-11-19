/**
 * @file Plane.ts
 * 
 * @brief A plane that can be rendered in a scene
 */

import { Vector2, Vector3 } from "../../MatrixMath/Vector.js";
import { BaseShape } from "./Shape.js";

const Y_PLANE_ROTATION = new Vector3(90, 0, 0);
const X_PLANE_ROTATION = new Vector3(0, 90, 0);

function planeVertices(width: number, height: number) {
    const dX = width / 2;
    const dY = height / 2;
    return [
        // Facing +Z
        new Vector3(dX, dY, 0),
        new Vector3(dX, -dY, 0),
        new Vector3(-dX, dY, 0),
        new Vector3(-dX, -dY, 0),
        // Facing -Z
        new Vector3(dX, dY, 0),
        new Vector3(dX, -dY, 0),
        new Vector3(-dX, dY, 0),
        new Vector3(-dX, -dY, 0),
    ];
}

function planeNormals() {
    return [
        // Facing +Z
        Vector3.NormalZ,
        Vector3.NormalZ,
        Vector3.NormalZ,
        Vector3.NormalZ,
        // Facing -Z
        Vector3.NormalZ.negated(true),
        Vector3.NormalZ.negated(true),
        Vector3.NormalZ.negated(true),
        Vector3.NormalZ.negated(true),
    ];
}

function planeRelativeIndices() {
    return [
        // Facing +Z
        0, 1, 2,
        0, 2, 3,
        // Facing -Z
        4, 5, 6,
        4, 6, 7,
    ];
}

function planeTextureCoordinates() {
    return [
        // Facing +Z
        new Vector2(0, 0),
        new Vector2(0, 1),
        new Vector2(1, 0),
        new Vector2(1, 1),
        // Facing -Z
        new Vector2(0, 0),
        new Vector2(0, 1),
        new Vector2(1, 0),
        new Vector2(1, 1),
    ];
}

/**
 * @class Plane
 * 
 * @brief A rectangular plane
 */
export class Plane extends BaseShape {

    /**
     * @brief Creates a plane facing the Z axis
     * 
     * @param width Width of the plane
     * @param height Height of the plane
     * @returns A new Plane instance
     */
    static makeZPlane(width: number, height: number) {
        return new Plane(width, height);
    }

    /**
     * @brief Creates a plane facing the Y axis
     * 
     * @param width Width of the plane
     * @param height Height of the plane
     * @returns A new Plane instance
     */
    static makeYPlane(width: number, height: number) {
        const plane = new Plane(width, height);
        plane.staticRotate(Y_PLANE_ROTATION);
        return plane;
    }

    /**
     * @brief Creates a plane facing the X axis
     * 
     * @param width Width of the plane
     * @param height Height of the plane
     * @returns A new Plane instance
     */
    static makeXPlane(width: number, height: number) {
        const plane = new Plane(width, height);
        plane.staticRotate(X_PLANE_ROTATION);
        return plane;
    }

    /**
     * @brief Creates a new Plane
     * 
     * @param width Width of the plane
     * @param height Height of the plane
     */
    constructor(width: number, height: number) {
        super(
            planeVertices(width, height),
            planeNormals(),
            planeRelativeIndices(),
            planeTextureCoordinates()
        )
    }
}