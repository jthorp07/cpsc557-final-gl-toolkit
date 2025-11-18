/**
 * @file Shape.ts
 * 
 * @brief An abstract class providing an interface and data members for topology
 *        and, static transformation, and instantiation to renderable objects.
 */

import { GLContext } from "../../GL/GLContext.js";
import { PackedGLShape } from "../../GL/types.js";
import { Vector3, Vector4, Vector2 } from "../../MatrixMath/Vector.js";
import { Matrix4 } from "../../MatrixMath/Matrix.js";
import { GLColor } from "../Textures/Color.js";
import { SolidColorTexture } from "../Textures/SolidColorTexture.js";
import { BaseTexture } from "../Textures/Texture.js";
import { Transform } from "../../MatrixMath/Transform.js";
import { PerVertexColorTexture } from "../Textures/PerVertexColorTexture.js";

export class BaseShape {

    private _vertices: Vector3[];
    private _normals: Vector3[];
    private _relativeIndices: number[];
    private _textureCoordinates: Vector2[];
    private _vertexCount: number;
    private _texture: BaseTexture = new SolidColorTexture(GLColor.Red);
    private _topology: PackedGLShape | undefined

    constructor(vertices: Vector3[], normals: Vector3[], relativeIndices: number[], textureCoordinates: Vector2[]) {
        this._vertices = vertices;
        this._vertexCount = vertices.length;
        this._normals = normals;
        this._relativeIndices = relativeIndices;
        this._textureCoordinates = textureCoordinates;
    }

    packedTexture() {
        return this._texture.packedData();
    }

    pack(context: GLContext) {
        if (this._topology) {
            this._topology.destroy();
            this._topology = undefined;
        }
        this._topology = context.packShape(this);
        this._texture.pack(context);
    }

    packedTopology() {
        if (!this._topology) throw new Error("This shape has not been packed");
        return this._topology;
    }

    vertices() {
        return this._vertices;
    }

    normals() {
        return this._normals;
    }

    relativeIndices() {
        return this._relativeIndices;
    }

    textureCoordinates() {
        return this._textureCoordinates;
    }

    vertexCount() {
        return this._vertexCount;
    }

    setColor(color: GLColor) {
        this._texture.destroy();
        this._texture = new SolidColorTexture(color);
    }

    setVertexColors(colors: GLColor[]): void {
        this._texture.destroy();
        if (colors.length === this._vertexCount) {
            this._texture = new PerVertexColorTexture(colors, 32.0);
        }
    }

    /**
     * @brief Transforms this shape's vertices in place
     * 
     * @param transformation Transformation matrix
     */
    staticTransform(transformation: Matrix4) {

        // Invalidate packed topology if set
        if (this._topology) {
            this._topology.destroy();
            this._topology = undefined;
        }

        // Transform
        let newVertices: Vector3[] = [];
        for (let i = 0; i < this._vertexCount; ++i) {
            const originalPoint = new Vector4(
                this._vertices[i].x,
                this._vertices[i].y,
                this._vertices[i].z,
                1
            );
            const transformedPoint = originalPoint.multiplyWithMatrix(transformation);
            newVertices.push(new Vector3(
                transformedPoint.x,
                transformedPoint.y,
                transformedPoint.z,
            ));
        }
        this._vertices = newVertices;
    }

    /**
     * @brief Translates this shape in 3D space
     * 
     * @param translation Translation vector
     */
    staticTranslate(translation: Vector3) {
        this.staticTransform(Transform.translate(translation));
    }

    /**
     * @brief Rotates this shape in 3D space
     * 
     * @param rotation Vector indicating how many degrees to rotate about each axis
     */
    staticRotate(rotation: Vector3) {

        if (rotation.x !== 0) {
            const xRadians = Transform.degreesToRadians(rotation.x);
            this.staticTransform(Transform.rotate(xRadians, "X"));
        }

        if (rotation.y !== 0) {
            const yRadians = Transform.degreesToRadians(rotation.y);
            this.staticTransform(Transform.rotate(yRadians, "Y"));
        }

        if (rotation.z !== 0) {
            const zRadians = Transform.degreesToRadians(rotation.z);
            this.staticTransform(Transform.rotate(zRadians, "Z"));
        }
    }

    /**
     * @brief Returns a deep copy of this
     */
    clone() {

        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const relativeIndices: number[] = [];
        const textureCoordinates: Vector2[] = [];
        for (const point of this._vertices) {
            vertices.push(point.clone());
        }
        for (const normal of this._normals) {
            normals.push(normal.clone());
        }
        for (const index of this._relativeIndices) {
            relativeIndices.push(index);
        }
        for (const point of this._textureCoordinates) {
            textureCoordinates.push(point.clone());
        }

        return new BaseShape(vertices, normals, relativeIndices, textureCoordinates);
    }

    /**
     * @brief Flattens an array of shapes into a single shape.
     * 
     * @warn Texture data will be reset to the default for the new shape,
     *       and only a single texture may be applied to the new shape.
     * 
     * @param shapes Shapes to flatten
     * @returns A single shape containing the flattened data of shapes
     */
    static flattenShapes(shapes: BaseShape[]) {

        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const relativeIndices: number[] = [];
        const textureCoordinates: Vector2[] = [];

        let relativeOffset = 0;
        for (const shape of shapes) {

            // Clone vertices
            for (const point of shape.vertices()) {
                vertices.push(point.clone());
            }

            // Clone normals
            for (const normal of shape.normals()) {
                normals.push(normal.clone());
            }

            // Clone relative indices
            for (const index of shape.relativeIndices()) {
                relativeIndices.push(index + relativeOffset);
            }

            // Clone texture coordinates
            for (const point of shape.textureCoordinates()) {
                textureCoordinates.push(point.clone());
            }
            relativeOffset += shape.vertices().length;
        }

        return new BaseShape(vertices, normals, relativeIndices, textureCoordinates);
    }
}
