/**
 * @file Box.ts
 * 
 * @brief A Box that can be rendered in a scene
 */

import { BaseShape } from "./Shape.js";
import { Vector2, Vector3 } from "../../MatrixMath/Vector.js";
import { GLColor } from "../Textures/Color.js";

function boxVertices(width: number, height: number, depth: number) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;
    return [
        // Facing +Z
        new Vector3(-halfWidth, -halfHeight, halfDepth),   // 0:  Vertex 1
        new Vector3(halfWidth, -halfHeight, halfDepth),    // 1:  Vertex 2
        new Vector3(halfWidth, halfHeight, halfDepth),     // 2:  Vertex 3
        new Vector3(-halfWidth, halfHeight, halfDepth),    // 3:  Vertex 4
        // Facing -Z
        new Vector3(-halfWidth, -halfHeight, -halfDepth),  // 4:  Vertex 5
        new Vector3(halfWidth, -halfHeight, -halfDepth),   // 5:  Vertex 6
        new Vector3(halfWidth, halfHeight, -halfDepth),    // 6:  Vertex 7
        new Vector3(-halfWidth, halfHeight, -halfDepth),   // 7:  Vertex 8
        // Facing +X
        new Vector3(halfWidth, -halfHeight, halfDepth),    // 8:  Vertex 2
        new Vector3(halfWidth, -halfHeight, -halfDepth),   // 9:  Vertex 6
        new Vector3(halfWidth, halfHeight, -halfDepth),    // 10: Vertex 7
        new Vector3(halfWidth, halfHeight, halfDepth),     // 11: Vertex 3
        // Facing -X
        new Vector3(-halfWidth, -halfHeight, -halfDepth),  // 12: Vertex 5
        new Vector3(-halfWidth, -halfHeight, halfDepth),   // 13: Vertex 1
        new Vector3(-halfWidth, halfHeight, halfDepth),    // 14: Vertex 4
        new Vector3(-halfWidth, halfHeight, -halfDepth),   // 15: Vertex 8
        // Facing +Y
        new Vector3(-halfWidth, halfHeight, halfDepth),    // 16: Vertex 4
        new Vector3(halfWidth, halfHeight, halfDepth),     // 17: Vertex 3
        new Vector3(halfWidth, halfHeight, -halfDepth),    // 18: Vertex 7
        new Vector3(-halfWidth, halfHeight, -halfDepth),   // 19: Vertex 8
        // Facing -Y
        new Vector3(-halfWidth, -halfHeight, -halfDepth),  // 20: Vertex 5
        new Vector3(halfWidth, -halfHeight, -halfDepth),   // 21: Vertex 6
        new Vector3(halfWidth, -halfHeight, halfDepth),    // 22: Vertex 2
        new Vector3(-halfWidth, -halfHeight, halfDepth),   // 23: Vertex 1
    ];
}

function boxNormals() {
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
        // Facing +X
        Vector3.NormalX,
        Vector3.NormalX,
        Vector3.NormalX,
        Vector3.NormalX,
        // Facing -X
        Vector3.NormalX.negated(true),
        Vector3.NormalX.negated(true),
        Vector3.NormalX.negated(true),
        Vector3.NormalX.negated(true),
        // Facing +Y
        Vector3.NormalY,
        Vector3.NormalY,
        Vector3.NormalY,
        Vector3.NormalY,
        // Facing -Y
        Vector3.NormalY.negated(true),
        Vector3.NormalY.negated(true),
        Vector3.NormalY.negated(true),
        Vector3.NormalY.negated(true),
    ];
}

function boxRelativeIndices() {
    return [
        // Facing +Z
        0, 1, 2,
        0, 2, 3,
        // Facing -Z
        4, 5, 6,
        4, 6, 7,
        // Facing +X
        8, 9, 10,
        8, 10, 11,
        // Facing -X
        12, 13, 14,
        12, 14, 15,
        // Facing +Y
        16, 18, 17,
        16, 19, 18,
        // Facing -Y
        20, 22, 21,
        20, 23, 22
    ];
}

function boxTextureCoordinates() {
    return [
        // Facing +Z
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
        // Facing -Z
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
        // Facing +X
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
        // Facing -X
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
        // Facing +Y
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
        // Facing -Z
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(1, 1),
    ];
}

function boxDuplicateVertexIndices() {
    return [
        [0, 13, 23],
        [1, 8, 22],
        [2, 11, 17],
        [3, 14, 16],
        [4, 12, 20],
        [5, 9, 21],
        [6, 10, 18],
        [7, 15, 19]
    ];
}

/**
 * @class Box
 * 
 * @brief A box shape
 */
export class Box extends BaseShape {

    /**
     * @brief Creates a new Box
     * 
     * @param width Length of the sides along the X axis
     * @param height Length of the sides along the Y axis
     * @param depth Length of the sides along the Z axis
     */
    constructor(width: number, height: number, depth: number) {
        super(
            boxVertices(depth, height, width),
            boxNormals(),
            boxRelativeIndices(),
            boxTextureCoordinates()
        );
    }

    /**
     * @brief Sets the colors of the box's vertices
     * 
     * @param colors Array of colors. Can be 8 (one per corner) or 24 (one per vertex)
     */
    override setVertexColors(colors: GLColor[]): void {

        const numColors = colors.length;
        switch (numColors) {
            case 8:
                const vertexColors = new Array<GLColor>(24);
                boxDuplicateVertexIndices().forEach((vertices, i) => {
                    for (const vertex of vertices) {
                        vertexColors[vertex] = colors[i];
                    }
                });
                super.setVertexColors(vertexColors);
                return;
            case 24:
                super.setVertexColors(colors);
                return;
            default:
                console.warn("Invalid number of colors received. Retaining current texture.");
                return;
        }
    }
}
