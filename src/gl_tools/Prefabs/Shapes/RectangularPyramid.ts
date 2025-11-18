/**
 * @file RectangularPyramid.ts
 * 
 * @brief A pyramid with a rectangular base that can be rendered in a scene
 */

import { Vector2, Vector3 } from "../../MatrixMath/Vector.js";
import { BaseShape } from "./Shape.js";

function rectangularPyramidVertices(baseWidth: number, baseDepth: number, height: number) {
    const dX = baseWidth / 2;
    const dZ = baseDepth / 2;
    const dY = height / 2;
    return [
        // Facing +Z
        new Vector3(-dX, -dY, dZ),
        new Vector3(dX, -dY, dZ),
        new Vector3(0, dY, 0),
        // Facing -Z
        new Vector3(dX, -dY, -dZ),
        new Vector3(-dX, -dY, -dZ),
        new Vector3(0, dY, 0),
        // Facing +X
        new Vector3(dX, -dY, dZ),
        new Vector3(dX, -dY, -dZ),
        new Vector3(0, dY, 0),
        // Facing -X
        new Vector3(-dX, -dY, -dZ),
        new Vector3(-dX, -dY, dZ),
        new Vector3(0, dY, 0),
        // Base
        new Vector3(-dX, -dY, dZ),
        new Vector3(dX, -dY, dZ),
        new Vector3(dX, -dY, -dZ),
        new Vector3(-dX, -dY, -dZ)
    ];
}

function rectangularPyramidNormals(vertices: Vector3[]) {

    // Facing +Z
    const positiveZEdgeOne = vertices[2].subtract(vertices[0]);
    const positiveZEdgeTwo = vertices[2].subtract(vertices[1]);
    const positiveZNormal = positiveZEdgeOne.cross(positiveZEdgeTwo);
    // Facing -Z
    const negativeZEdgeOne = vertices[5].subtract(vertices[3]);
    const negativeZEdgeTwo = vertices[5].subtract(vertices[4]);
    const negativeZNormal = negativeZEdgeOne.cross(negativeZEdgeTwo);
    // Facing +X
    const positiveXEdgeOne = vertices[8].subtract(vertices[6]);
    const positiveXEdgeTwo = vertices[8].subtract(vertices[7]);
    const positiveXNormal = positiveXEdgeOne.cross(positiveXEdgeTwo);
    // Facing -X
    const negativeXEdgeOne = vertices[11].subtract(vertices[9]);
    const negativeXEdgeTwo = vertices[11].subtract(vertices[10]);
    const negativeXNormal = negativeXEdgeOne.cross(negativeXEdgeTwo);

    return [
        // Facing +Z
        positiveZNormal.clone(),
        positiveZNormal.clone(),
        positiveZNormal.clone(),
        // Facing -Z
        negativeZNormal.clone(),
        negativeZNormal.clone(),
        negativeZNormal.clone(),
        // Facing +X
        positiveXNormal.clone(),
        positiveXNormal.clone(),
        positiveXNormal.clone(),
        // Facing -X
        negativeXNormal.clone(),
        negativeXNormal.clone(),
        negativeXNormal.clone(),
        // Base
        Vector3.NormalY.negated(true),
        Vector3.NormalY.negated(true),
        Vector3.NormalY.negated(true),
        Vector3.NormalY.negated(true),
    ];
}

function rectangularPyramidRelativeIndices() {
    return [
        // Facing +Z
        0, 1, 2,
        // Facing -Z
        3, 4, 5,
        // Facing +X
        6, 7, 8,
        // Facing -X
        9, 10, 11,
        // Base
        12, 13, 14,
        12, 14, 15,
    ];
}

function rectangularPyramidTextureCoordinates() {
    return [
        // Facing +Z
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0.5, 1),
        // Facing -Z
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0.5, 1),
        // Facing +X
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0.5, 1),
        // Facing -X
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0.5, 1),
        // Base
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
    ]
}

export class RectangularPyramid extends BaseShape {

    constructor(baseWidth: number, baseDepth: number, height: number) {
        const vertices = rectangularPyramidVertices(baseWidth, baseDepth, height)
        super(
            vertices,
            rectangularPyramidNormals(vertices),
            rectangularPyramidRelativeIndices(),
            rectangularPyramidTextureCoordinates()
        );
    }
}