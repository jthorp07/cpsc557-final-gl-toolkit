/**
 * @file Vector.ts
 * 
 * @brief Vector classes the wrap WebGL-compatible arrays as well as
 *        utility functions to perform common vector operations
 */

import { Matrix4 } from "./Matrix.js";

/**
 * @brief A 2D Vector class capable of computing vector operations on itself and other vectors.
 */
export class Vector2 extends Float32Array {

    constructor(x = 0, y = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }

    // Property accessors and mutators
    get x(): number { return this[0] };
    set x(val: number) { this[0] = val; };
    get y(): number { return this[1] };
    set y(val: number) { this[1] = val; };

    /**
     * @brief Computes the magnitude (length) of this vector in 2D space
     * 
     * @returns The magnitude of this vector
     */
    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /**
     * @brief Computes a normalized vector in this vector's direction
     * 
     * @returns A new vector with the same direction as this vector and magnitude 1
     */
    normalized() {
        let mag = this.magnitude();
        return new Vector4(this.x / mag, this.y / mag);
    }

    /**
     * @brief Computes the dot product between two vectors
     * 
     * @param other Other vector to dot with this
     * @returns The dot product of this and other
     */
    dot(other: Vector2) {
        return (this.x * other.x) + (this.y * other.y);
    }

    /**
     * @brief Returns a new vector that is this vector but negated
     * 
     * @returns 
     */
    negated() {
        return new Vector2(-this.x, -this.y);
    }

    /**
     * @brief Returns a new vector that is this vector but scaled by a scalar
     * 
     * @param scalar Amount to scale this vector by
     * @returns 
     */
    scaled(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}

/**
 * @brief A 3D Vector class capable of computing vector operations on itself and other vectors.
 */
export class Vector3 extends Float32Array {

    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    // Property accessors and mutators
    get x(): number { return this[0] };
    set x(val: number) { this[0] = val; };
    get y(): number { return this[1] };
    set y(val: number) { this[1] = val; };
    get z(): number { return this[2]; };
    set z(val: number) { this[2] = val; };

    // Property constructors for normals
    static get NormalX(): Vector3 { return new Vector3(1, 0, 0); };
    static get NormalY(): Vector3 { return new Vector3(0, 1, 0); };
    static get NormalZ(): Vector3 { return new Vector3(0, 0, 1); };

    /**
     * @brief Computes the magnitude (length) of this vector in 4D space
     * 
     * @returns The magnitude of this vector
     */
    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z))
    }

    /**
     * @brief Computes a normalized vector in this vector's direction
     * 
     * @param inPlace If true, normalizes in place and returns this instead of a new vector
     * @returns A new vector with the same direction as this vector and magnitude 1
     */
    normalized(inPlace: boolean = false) {
        let mag = this.magnitude();
        if (!inPlace) return new Vector3(this.x / mag, this.y / mag, this.z / mag);
        this.x = this.x / mag;
        this.y = this.y / mag;
        this.z = this.z / mag;
        return this;
    }

    /**
     * @brief Computes the dot product between two vectors
     * 
     * @param other Other vector to dot with this
     * @returns The dot product of this and other
     */
    dot(other: Vector3) {
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
    }

    /**
     * @brief Computes the cross product between two vectors
     * 
     * @param other Other vector to cross with this
     * @returns The cross product of this and other
     */
    cross(other: Vector3) {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    /**
     * @brief Returns a new vector that is this vector but negated
     * 
     * @param inPlace If true, negates in place and returns this instead of a new vector
     * @returns A negated vector
     */
    negated(inPlace: boolean = false) {
        if (!inPlace) return new Vector3(-this.x, -this.y, -this.z);
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * @brief Returns a new vector that is this vector but scaled by a scalar
     * 
     * @param scalar Amount to scale this vector by
     * @param inPlace If true, scales in place and returns this instead of a new vector
     * @returns A scaled vector
     */
    scaled(scalar: number, inPlace: boolean = false) {
        if (!inPlace) return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
        return this;
    }

    /**
     * @brief Sums two vectors
     * 
     * @param other Vector to sum with this
     * @param inPlace If true, sums in place and returns this instead of a new vector
     */
    add(other: Vector3, inPlace: boolean = false) {
        if (!inPlace) return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    /**
     * @brief Difference of two vectors
     * 
     * @param other Vector to subtract from this
     * @param inPlace If true, subtracts in place and returns this instead of a new vector
     */
    subtract(other: Vector3, inPlace: boolean = false) {
        if (!inPlace) return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /**
     * @brief Product of two vectors
     * 
     * @param other Vector to multiply with this
     * @param inPlace If true, multiplies in place and returns this instead of a new vector
     */
    multiply(other: Vector3, inPlace: boolean = false) {
        if (!inPlace) return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    /**
     * @brief Quitient of two vectors
     * 
     * @param other Vector to divide from this
     * @param inPlace If true, divides in place and returns this instead of a new vector
     */
    divide(other: Vector3, inPlace: boolean = false) {
        if (!inPlace) return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    /**
     * @brief Clones this vector
     * 
     * @returns A new vector that is a copy of this
     */
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}

/**
 * @brief A 4D Vector class capable of computing vector operations on itself and other vectors.
 */
export class Vector4 extends Float32Array {

    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }

    // Property accessors and mutators
    get x(): number { return this[0] };
    set x(val: number) { this[0] = val; };
    get y(): number { return this[1] };
    set y(val: number) { this[1] = val; };
    get z(): number { return this[2]; };
    set z(val: number) { this[2] = val; };
    get w(): number { return this[3]; };
    set w(val: number) { this[3] = val; };

    /**
     * @brief Computes the magnitude (length) of this vector in 4D space
     * 
     * @returns The magnitude of this vector
     */
    magnitude() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + 
            (this.z * this.z) + (this.w * this.w)
        );
    }

    /**
     * @brief Computes a normalized vector in this vector's direction
     * 
     * @returns A new vector with the same direction as this vector and magnitude 1
     */
    normalized() {
        let mag = this.magnitude();
        return new Vector4(this.x / mag, this.y / mag, this.z / mag, this.w / mag);
    }

    /**
     * @brief Computes the dot product between two vectors
     * 
     * @param other Other vector to dot with this
     * @returns The dot product of this and other
     */
    dot(other: Vector4) {
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z) + (this.w * other.w);
    }

    /**
     * @brief Computes the cross product between two vectors
     * 
     * @param other Other vector to cross with this
     * @returns The cross product of this and other
     */
    cross(other: Vector4) {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    /**
     * @brief Returns a new vector that is this vector but negated
     * 
     * @returns A negated vector
     */
    negated() {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }

    /**
     * @brief Returns a new vector that is this vector but scaled by a scalar
     * 
     * @param scalar Amount to scale this vector by
     * @returns A scaled vector
     */
    scaled(scalar: number) {
        return new Vector4(
            this.x * scalar, this.y * scalar,
            this.z * scalar, this.w * scalar
        );
    }

    /**
     * @brief Clones this vector
     * 
     * @returns A new vector that is a copy of this
     */
    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    multiplyWithMatrix(matrix: Matrix4) {
        const [x, y, z, w] = matrix.rows();
        return new Vector4(this.dot(x), this.dot(y), this.dot(z), this.dot(w));
    }
}

export function flattenVectors(vectors: Float32Array[]) {
    let flattenedLength = 0;
    for (const vector of vectors) {
        flattenedLength += vector.length;
    }
    let flattened = new Float32Array(flattenedLength);
    let currentIndex = 0;
    for (const vector of vectors) {
        for (let i = 0; i < vector.length; ++i) {
            flattened[currentIndex] = vector[i];
            ++currentIndex;
        }
    }
    return flattened;
}
