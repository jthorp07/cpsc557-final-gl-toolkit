/**
 * @file Matrix.ts
 * 
 * @brief Matrix classes the wrap WebGL-compatible arrays as well as
 *        utility functions to perform common matrix operations
 */

import { Vector3, Vector4 } from "./Vector.js";

export class Matrix3 extends Float32Array {

    // Row indices for quick iteration
    private static readonly ROW_ONE_INDICES = [0, 3, 6] as const;
    private static readonly ROW_TWO_INDICES = [1, 4, 7] as const;
    private static readonly ROW_THREE_INDICES = [2, 5, 8] as const;
    // Column indices for quick iteration
    private static readonly COLUMN_ONE_INDICES = [0, 1, 2] as const;
    private static readonly COLUMN_TWO_INDICES = [3, 4, 5] as const;
    private static readonly COLUMN_THREE_INDICES = [6, 7, 8] as const;

    /*
        0   3   6
        1   4   7
        2   5   8
    */
    constructor() {
        super(9);
    }

    set rowOne(row: Vector3) { 
        this[Matrix3.ROW_ONE_INDICES[0]] = row.x
        this[Matrix3.ROW_ONE_INDICES[1]] = row.y
        this[Matrix3.ROW_ONE_INDICES[2]] = row.z
    }
    set rowTwo(row: Vector3) { 
        this[Matrix3.ROW_TWO_INDICES[0]] = row.x
        this[Matrix3.ROW_TWO_INDICES[1]] = row.y
        this[Matrix3.ROW_TWO_INDICES[2]] = row.z
    }
    set rowThree(row: Vector3) { 
        this[Matrix3.ROW_THREE_INDICES[0]] = row.x
        this[Matrix3.ROW_THREE_INDICES[1]] = row.y
        this[Matrix3.ROW_THREE_INDICES[2]] = row.z
    }
    set columnOne(column: Vector3) { 
        this[Matrix3.COLUMN_ONE_INDICES[0]] = column.x
        this[Matrix3.COLUMN_ONE_INDICES[1]] = column.y
        this[Matrix3.COLUMN_ONE_INDICES[2]] = column.z
    }
    set columnTwo(column: Vector3) { 
        this[Matrix3.COLUMN_TWO_INDICES[0]] = column.x
        this[Matrix3.COLUMN_TWO_INDICES[1]] = column.y
        this[Matrix3.COLUMN_TWO_INDICES[2]] = column.z
    }
    set columnThree(column: Vector3) { 
        this[Matrix3.COLUMN_THREE_INDICES[0]] = column.x
        this[Matrix3.COLUMN_THREE_INDICES[1]] = column.y
        this[Matrix3.COLUMN_THREE_INDICES[2]] = column.z
    }

    /**
     * @brief Copy-accessor for the rows of this matrix as vectors
     * 
     * @returns An array of vectors with this metrix's row elements
     */
    rows() {
        return [
            new Vector3(
                this[Matrix3.ROW_ONE_INDICES[0]],
                this[Matrix3.ROW_ONE_INDICES[1]],
                this[Matrix3.ROW_ONE_INDICES[2]],
            ),
            new Vector3(
                this[Matrix3.ROW_TWO_INDICES[0]],
                this[Matrix3.ROW_TWO_INDICES[1]],
                this[Matrix3.ROW_TWO_INDICES[2]],
            ),
            new Vector3(
                this[Matrix3.ROW_THREE_INDICES[0]],
                this[Matrix3.ROW_THREE_INDICES[1]],
                this[Matrix3.ROW_THREE_INDICES[2]],
            ),
        ]
    }

    /**
     * @brief Copy-accessor for the columns of this matrix as vectors
     * 
     * @returns An array of vectors with this metrix's column elements
     */
    columns() {
        return [
            new Vector3(
                this[Matrix3.COLUMN_ONE_INDICES[0]],
                this[Matrix3.COLUMN_ONE_INDICES[1]],
                this[Matrix3.COLUMN_ONE_INDICES[2]],
            ),
            new Vector3(
                this[Matrix3.COLUMN_TWO_INDICES[0]],
                this[Matrix3.COLUMN_TWO_INDICES[1]],
                this[Matrix3.COLUMN_TWO_INDICES[2]],
            ),
            new Vector3(
                this[Matrix3.COLUMN_THREE_INDICES[0]],
                this[Matrix3.COLUMN_THREE_INDICES[1]],
                this[Matrix3.COLUMN_THREE_INDICES[2]],
            ),
        ]
    }

    /**
     * @brief Transforms this to an identity matrix in-place,
     *        then returns itself to allow chaining calls.
     * 
     * @returns this for chaining
     */
    toIdentity() {
        this.fill(0);
        this[Matrix3.index(0, 0)] = 1;
        this[Matrix3.index(1, 1)] = 1;
        this[Matrix3.index(2, 2)] = 1;
        return this;
    }

    /**
     * @brief Makes a new matrix that is the product of this and another matrix.
     * 
     * @param other Matrix to multiply this with
     * 
     * @returns New matrix that is the product of this and other
     */
    multiply(other: Matrix3) {
        const newMatrix = new Matrix3();
        const myRows = this.rows();
        const otherColumns = other.columns();

        for (let row = 0; row < 3; ++row) {
            for (let column = 0; column < 3; ++column) {
                newMatrix[Matrix3.index(row, column)] = myRows[row].dot(otherColumns[column]);
            }
        }

        return newMatrix;
    }

    multiplyVector(vector: Vector3) {
        const rows = this.rows();
        return new Vector3(
            rows[0].dot(vector),
            rows[1].dot(vector),
            rows[2].dot(vector),
        );
    }

    determinant() {

        let determinant = 0;
        for (let i = 0; i < 3; ++i) {
            determinant += (this[Matrix3.index(i, 0)] * this.cofactor(i, 0));
        }
        return determinant;
    }

    minor(row: number, column: number) {

        this.validateIndices(row, column);
        const submatrix: number[] = [];
        for (let i = 0; i < 3; ++i) {
            if (i === row) continue;
            for (let j = 0; j < 3; ++j) {
                if (j === column) continue;
                submatrix.push(this[Matrix3.index(i, j)]);
            }
        }

        return (submatrix[0] * submatrix[3]) - (submatrix[1] * submatrix[2]);
    }

    cofactor(row: number, column: number) {
        const sign = (row + column) % 2 === 0 ? 1 : -1;
        return sign * this.minor(row, column);
    }

    inverse() {
        const determinant = this.determinant();
        if (Math.abs(determinant) <= Number.EPSILON) throw new Error("Cannot invert a singular matrix");
        const inverse = new Matrix3();
        for (let row = 0; row < 3; ++row) {
            for (let column = 0; column < 3; ++column) {
                inverse[Matrix3.index(row, column)] = this.cofactor(column, row) / determinant;
            }
        }
        return inverse;
    }

    transpose() {
        const transposed = new Matrix3();
        for (let row = 0; row < 3; ++row) {
            for (let column = 0; column < 3; ++column) {
                transposed[Matrix3.index(row, column)] = this[Matrix3.index(column, row)];
            }
        }
        return transposed;
    }

    private validateIndices(row: number, column: number) {
        if (row < 0 || row > 2 || column < 0 || column > 2) throw new Error("Invalid index: row and column must be in the range [0, 2]")
    }

    /**
     * @brief Helper for converting to a column major memory
     *        layout
     * 
     * @param row Virtual row index
     * @param column Virtual column index
     */
    static index(row: number, column: number) {
        return (column * 3) + row;
    }
}

/**
 * @brief A 4x4 matrix class represented in a WebGL-compatible manner
 *        with methods to assist with common geometric transformations
 *        and other graphics-related functionality.
 */
export class Matrix4 extends Float32Array {

    static lookAt(eyePosition: Vector3, targetPosition: Vector3, cameraUp: Vector3 = Vector3.NormalY) {
        const forward = eyePosition.subtract(targetPosition).normalized(true);
        const right = cameraUp.cross(forward).normalized(true);
        const up = forward.cross(right);
        const lookAtMatrix = new Matrix4();

        lookAtMatrix[Matrix4.COLUMN_ONE_INDICES[0]] = right.x;
        lookAtMatrix[Matrix4.COLUMN_ONE_INDICES[1]] = up.x;
        lookAtMatrix[Matrix4.COLUMN_ONE_INDICES[2]] = forward.x;
        lookAtMatrix[Matrix4.COLUMN_ONE_INDICES[3]] = 0;

        lookAtMatrix[Matrix4.COLUMN_TWO_INDICES[0]] = right.y;
        lookAtMatrix[Matrix4.COLUMN_TWO_INDICES[1]] = up.y;
        lookAtMatrix[Matrix4.COLUMN_TWO_INDICES[2]] = forward.y;
        lookAtMatrix[Matrix4.COLUMN_TWO_INDICES[3]] = 0;

        lookAtMatrix[Matrix4.COLUMN_THREE_INDICES[0]] = right.z;
        lookAtMatrix[Matrix4.COLUMN_THREE_INDICES[1]] = up.z;
        lookAtMatrix[Matrix4.COLUMN_THREE_INDICES[2]] = forward.z;
        lookAtMatrix[Matrix4.COLUMN_THREE_INDICES[3]] = 0;

        lookAtMatrix[Matrix4.COLUMN_FOUR_INDICES[0]] = -right.dot(eyePosition);
        lookAtMatrix[Matrix4.COLUMN_FOUR_INDICES[1]] = -up.dot(eyePosition);
        lookAtMatrix[Matrix4.COLUMN_FOUR_INDICES[2]] = -forward.dot(eyePosition);
        lookAtMatrix[Matrix4.COLUMN_FOUR_INDICES[3]] = 1;

        return lookAtMatrix;
    }

    static perspectiveProjection(fieldOfView: number, aspectRatio: number, near: number, far: number) {

        const yClip = 1.0 / Math.tan(fieldOfView / 2.0);
        const xClip = yClip / aspectRatio;
        const zScale = (near + far) / (near - far);
        const zOffset = (2 * near * far) / (near - far);
        const wClip = -1 as const;

        const perspective = new Matrix4();
        perspective[this.index(0, 0)] = xClip;
        perspective[Matrix4.ROW_TWO_INDICES[1]] = yClip;
        perspective[Matrix4.ROW_THREE_INDICES[2]] = zScale;
        perspective[Matrix4.ROW_THREE_INDICES[3]] = zOffset;
        perspective[Matrix4.ROW_FOUR_INDICES[2]] = wClip;

        return perspective;
    }

    // Row indices for quick iteration
    private static readonly ROW_ONE_INDICES = [0, 4, 8, 12] as const;
    private static readonly ROW_TWO_INDICES = [1, 5, 9, 13] as const;
    private static readonly ROW_THREE_INDICES = [2, 6, 10, 14] as const;
    private static readonly ROW_FOUR_INDICES = [3, 7, 11, 15] as const;
    // Column indices for quick iteration
    private static readonly COLUMN_ONE_INDICES = [0, 1, 2, 3] as const;
    private static readonly COLUMN_TWO_INDICES = [4, 5, 6, 7] as const;
    private static readonly COLUMN_THREE_INDICES = [8, 9, 10, 11] as const;
    private static readonly COLUMN_FOUR_INDICES = [12, 13, 14, 15] as const;

    /*
        0   4   8   12
        1   5   9   13
        2   6   10  14
        3   7   11  15
    */
    constructor() {
        super(16);
    }

    set rowOne(row: Vector4) { 
        this[Matrix4.ROW_ONE_INDICES[0]] = row.x;
        this[Matrix4.ROW_ONE_INDICES[1]] = row.y;
        this[Matrix4.ROW_ONE_INDICES[2]] = row.z;
        this[Matrix4.ROW_ONE_INDICES[3]] = row.w;
    }
    set rowTwo(row: Vector4) { 
        this[Matrix4.ROW_TWO_INDICES[0]] = row.x;
        this[Matrix4.ROW_TWO_INDICES[1]] = row.y;
        this[Matrix4.ROW_TWO_INDICES[2]] = row.z;
        this[Matrix4.ROW_TWO_INDICES[3]] = row.w;
    }
    set rowThree(row: Vector4) { 
        this[Matrix4.ROW_THREE_INDICES[0]] = row.x;
        this[Matrix4.ROW_THREE_INDICES[1]] = row.y;
        this[Matrix4.ROW_THREE_INDICES[2]] = row.z;
        this[Matrix4.ROW_THREE_INDICES[3]] = row.w;
    }
    set rowFour(row: Vector4) { 
        this[Matrix4.ROW_FOUR_INDICES[0]] = row.x;
        this[Matrix4.ROW_FOUR_INDICES[1]] = row.y;
        this[Matrix4.ROW_FOUR_INDICES[2]] = row.z;
        this[Matrix4.ROW_FOUR_INDICES[3]] = row.w;
    }
    set columnOne(column: Vector4) { 
        this[Matrix4.COLUMN_ONE_INDICES[0]] = column.x;
        this[Matrix4.COLUMN_ONE_INDICES[1]] = column.y;
        this[Matrix4.COLUMN_ONE_INDICES[2]] = column.z;
        this[Matrix4.COLUMN_ONE_INDICES[3]] = column.w;
    }
    set columnTwo(column: Vector4) { 
        this[Matrix4.COLUMN_TWO_INDICES[0]] = column.x;
        this[Matrix4.COLUMN_TWO_INDICES[1]] = column.y;
        this[Matrix4.COLUMN_TWO_INDICES[2]] = column.z;
        this[Matrix4.COLUMN_TWO_INDICES[3]] = column.w;
    }
    set columnThree(column: Vector4) { 
        this[Matrix4.COLUMN_THREE_INDICES[0]] = column.x;
        this[Matrix4.COLUMN_THREE_INDICES[1]] = column.y;
        this[Matrix4.COLUMN_THREE_INDICES[2]] = column.z;
        this[Matrix4.COLUMN_THREE_INDICES[3]] = column.w;
    }
    set columnFour(column: Vector4) { 
        this[Matrix4.COLUMN_FOUR_INDICES[0]] = column.x;
        this[Matrix4.COLUMN_FOUR_INDICES[1]] = column.y;
        this[Matrix4.COLUMN_FOUR_INDICES[2]] = column.z;
        this[Matrix4.COLUMN_FOUR_INDICES[3]] = column.w;
    }

    /**
     * Copy-accessor for the rows of this matrix as vectors
     * 
     * @returns An array of vectors with this matrix's row elements
     */
    rows(): Vector4[] {
        return [
            new Vector4(
                this[Matrix4.ROW_ONE_INDICES[0]],
                this[Matrix4.ROW_ONE_INDICES[1]],
                this[Matrix4.ROW_ONE_INDICES[2]],
                this[Matrix4.ROW_ONE_INDICES[3]]
            ),
            new Vector4(
                this[Matrix4.ROW_TWO_INDICES[0]],
                this[Matrix4.ROW_TWO_INDICES[1]],
                this[Matrix4.ROW_TWO_INDICES[2]],
                this[Matrix4.ROW_TWO_INDICES[3]]
            ),
            new Vector4(
                this[Matrix4.ROW_THREE_INDICES[0]],
                this[Matrix4.ROW_THREE_INDICES[1]],
                this[Matrix4.ROW_THREE_INDICES[2]],
                this[Matrix4.ROW_THREE_INDICES[3]]
            ),
            new Vector4(
                this[Matrix4.ROW_FOUR_INDICES[0]],
                this[Matrix4.ROW_FOUR_INDICES[1]],
                this[Matrix4.ROW_FOUR_INDICES[2]],
                this[Matrix4.ROW_FOUR_INDICES[3]]
            )
        ]
    }

    /**
     * Copy-accessor for the column of this matrix as vectors
     * 
     * @returns An array of vectors with this matrix's column elements
     */
    columns(): Vector4[] {
        return [
            new Vector4(
                this[Matrix4.COLUMN_ONE_INDICES[0]],
                this[Matrix4.COLUMN_ONE_INDICES[1]],
                this[Matrix4.COLUMN_ONE_INDICES[2]],
                this[Matrix4.COLUMN_ONE_INDICES[3]]
            ),
            new Vector4(
                this[Matrix4.COLUMN_TWO_INDICES[0]],
                this[Matrix4.COLUMN_TWO_INDICES[1]],
                this[Matrix4.COLUMN_TWO_INDICES[2]],
                this[Matrix4.COLUMN_TWO_INDICES[3]]
            ),
            new Vector4(
                this[Matrix4.COLUMN_THREE_INDICES[0]],
                this[Matrix4.COLUMN_THREE_INDICES[1]],
                this[Matrix4.COLUMN_THREE_INDICES[2]],
                this[Matrix4.COLUMN_THREE_INDICES[3]]
            ),
            new Vector4(
                this[Matrix4.COLUMN_FOUR_INDICES[0]],
                this[Matrix4.COLUMN_FOUR_INDICES[1]],
                this[Matrix4.COLUMN_FOUR_INDICES[2]],
                this[Matrix4.COLUMN_FOUR_INDICES[3]]
            )
        ]
    }

    /**
     * @brief Transforms this to an identity matrix in-place,
     *        then returns itself to allow chaining calls.
     * 
     * @returns this for chaining
     */
    toIdentity() {
        this.fill(0);
        this[0] = 1;
        this[5] = 1;
        this[10] = 1;
        this[15] = 1;
        return this;
    }

    /**
     * @brief Makes a new matrix that is the product of this and another matrix.
     * 
     * @param other Matrix to multiply this with
     * 
     * @returns New matrix that is the product of this and other
     */
    multiply(other: Matrix4) {
        const newMatrix = new Matrix4();
        const myRows = this.rows();
        const otherColumns = other.columns();

        for (let row = 0; row < 4; ++row) {
            for (let column = 0; column < 4; ++column) {
                newMatrix[(column * 4) + row] = myRows[row].dot(otherColumns[column]);
            }
        }

        return newMatrix;
    }

    multiplyVector(vector: Vector4) {
        const rows = this.rows();
        return new Vector4(
            rows[0].dot(vector),
            rows[1].dot(vector),
            rows[2].dot(vector),
            rows[3].dot(vector),
        );
    }

    toMatrix3() {
        return this.submatrix(3, 3);
    }

    determinant() {

        let determinant = 0;
        for (let i = 0; i < 4; ++i) {
            determinant += (this[Matrix4.index(i, 0)] * this.cofactor(i, 0));
        }
        return determinant;
    }

    submatrix(row: number, column: number) {

        const submatrix = new Matrix3();

        for (let r = 0; r < 3; ++r) {
            if (r === row) continue;
            for (let c = 0; c < 3; ++c) {
                if (c === column) continue;
                submatrix[Matrix3.index(r, c)] = this[Matrix4.index(r, c)];
            }
        }

        return submatrix;
    }

    minor(row: number, column: number) {
        return this.submatrix(row, column).determinant();
    }

    cofactor(row: number, column: number) {
        const sign = (row + column) % 2 === 0 ? 1 : -1;
        return sign * this.minor(row, column);
    }

    isAffine() {
        return Math.abs(this[Matrix4.ROW_FOUR_INDICES[0]]) <= Number.EPSILON &&
                Math.abs(this[Matrix4.ROW_FOUR_INDICES[1]]) <= Number.EPSILON &&
                Math.abs(this[Matrix4.ROW_FOUR_INDICES[2]]) <= Number.EPSILON &&
                Math.abs(this[Matrix4.ROW_FOUR_INDICES[3]] - 1) <= Number.EPSILON;
    }

    inverse() {
        return this.isAffine() ? this._inverseAffine() : this._inverseAdjoint();
    }

    private _inverseAdjoint() {

        const determinant = this.determinant();
        if (Math.abs(determinant) <= Number.EPSILON) throw new Error("Cannot invert a singular matrix");
        const inverse = new Matrix4();
        for (let row = 0; row < 4; ++row) {
            for (let column = 0; column < 4; ++column) {
                inverse[Matrix4.index(row, column)] = this.cofactor(column, row) / determinant;
            }
        }

        return inverse;
    }

    private _inverseAffine() {

        const subInverse = this.toMatrix3().inverse();
        const translation = new Vector3(
            this[Matrix4.COLUMN_FOUR_INDICES[0]],
            this[Matrix4.COLUMN_FOUR_INDICES[1]],
            this[Matrix4.COLUMN_FOUR_INDICES[2]],
        );
        const invertedTranslation = subInverse.multiplyVector(translation).negated(true);
        
        const inverse = new Matrix4().toIdentity();
        for (let row = 0; row < 3; ++row) {
            for (let column = 0; column < 3; ++column) {
                inverse[Matrix4.index(row, column)] = subInverse[Matrix3.index(row, column)];
            }
            inverse[Matrix4.COLUMN_FOUR_INDICES[row]] = invertedTranslation[row];
        }

        return inverse;
    }

    transpose() {
        const transposed = new Matrix4();
        for (let row = 0; row < 4; ++row) {
            for (let column = 0; column < 4; ++column) {
                transposed[Matrix4.index(row, column)] = this[Matrix4.index(column, row)];
            }
        }
        return transposed;
    }

    /**
     * @brief Helper for converting to a column major memory
     *        layout
     * 
     * @param row Virtual row index
     * @param column Virtual column index
     */
    static index(row: number, column: number) {
        return (column * 4) + row;
    }
}
