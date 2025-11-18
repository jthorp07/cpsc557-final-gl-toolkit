/**
 * @file Cube.ts
 * 
 * @brief A Cube that can be rendered in a scene
 */

import { BaseShape } from "./Shape.js";
import { Vector2, Vector3 } from "../../MatrixMath/Vector.js";
import { GLColor } from "../Textures/Color.js";

function cubeVertices(halfLength: number) {
    return [
        // Facing +Z
        new Vector3(-halfLength, -halfLength, halfLength),   // 0:  Vertex 1
        new Vector3(halfLength, -halfLength, halfLength),    // 1:  Vertex 2
        new Vector3(halfLength, halfLength, halfLength),     // 2:  Vertex 3
        new Vector3(-halfLength, halfLength, halfLength),    // 3:  Vertex 4
        // Facing -Z
        new Vector3(-halfLength, -halfLength, -halfLength),  // 4:  Vertex 5
        new Vector3(halfLength, -halfLength, -halfLength),   // 5:  Vertex 6
        new Vector3(halfLength, halfLength, -halfLength),    // 6:  Vertex 7
        new Vector3(-halfLength, halfLength, -halfLength),   // 7:  Vertex 8
        // Facing +X
        new Vector3(halfLength, -halfLength, halfLength),    // 8:  Vertex 2
        new Vector3(halfLength, -halfLength, -halfLength),   // 9:  Vertex 6
        new Vector3(halfLength, halfLength, -halfLength),    // 10: Vertex 7
        new Vector3(halfLength, halfLength, halfLength),     // 11: Vertex 3
        // Facing -X
        new Vector3(-halfLength, -halfLength, -halfLength),  // 12: Vertex 5
        new Vector3(-halfLength, -halfLength, halfLength),   // 13: Vertex 1
        new Vector3(-halfLength, halfLength, halfLength),    // 14: Vertex 4
        new Vector3(-halfLength, halfLength, -halfLength),   // 15: Vertex 8
        // Facing +Y
        new Vector3(-halfLength, halfLength, halfLength),    // 16: Vertex 4
        new Vector3(halfLength, halfLength, halfLength),     // 17: Vertex 3
        new Vector3(halfLength, halfLength, -halfLength),    // 18: Vertex 7
        new Vector3(-halfLength, halfLength, -halfLength),   // 19: Vertex 8
        // Facing -Y
        new Vector3(-halfLength, -halfLength, -halfLength),  // 20: Vertex 5
        new Vector3(halfLength, -halfLength, -halfLength),   // 21: Vertex 6
        new Vector3(halfLength, -halfLength, halfLength),    // 22: Vertex 2
        new Vector3(-halfLength, -halfLength, halfLength),   // 23: Vertex 1
    ];
}

function cubeNormals() {
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

function cubeRelativeIndices() {
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
        16, 17, 18,
        16, 18, 19,
        // Facing -Y
        20, 21, 22,
        20, 22, 23
    ];
}

function cubeTextureCoordinates() {
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

function cubeDuplicateVertexIndices() {
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

export class Cube extends BaseShape {
    
    constructor(sideLength: number = 1.0) {
        const halfLength = sideLength / 2;
        super(
            cubeVertices(halfLength),
            cubeNormals(),
            cubeRelativeIndices(),
            cubeTextureCoordinates()
        );
    }

    override setVertexColors(colors: GLColor[]): void {

        const numColors = colors.length;
        switch (numColors) {
            case 8:
                const vertexColors = new Array<GLColor>(24);
                cubeDuplicateVertexIndices().forEach((vertices, i) => {
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
