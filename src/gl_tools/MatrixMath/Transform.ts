/**
 * @file Transform.ts
 * 
 * @brief Factory functions to create matrices for geometric transformations.
 */

import { Matrix4, Vector3, Vector4 } from "./index.js";

/**
 * @brief A class to act as a namespace for the functions implemented in this file.
 */
export class Transform {

    /**
     * @brief Converts an angle from degrees to radians
     * 
     * @param degrees Angle in degrees
     * @returns Angle in radians
     */
    static degreesToRadians(degrees: number) {
        return degrees * Math.PI / 180;
    }

    /**
     * @brief Creates a matrix that can be used to rotate a point in 3D space.
     * 
     * @param radians Angle the matrix should rotate (in radians)
     * @param axis Axis the matrix should rotate about
     * @returns A rotation matrix
     */
    static rotate(radians: number, axis: "X" | "Y" | "Z") {
        const matrix = new Matrix4().toIdentity();
        const cosineTheta = Math.cos(radians);
        const sineTheta = Math.sin(radians);
        switch (axis) {
            case "X":
                matrix[5] = cosineTheta;
                matrix[6] = sineTheta;
                matrix[9] = -sineTheta;
                matrix[10] = cosineTheta;
                break;
            case "Y":
                matrix[0] = cosineTheta;
                matrix[2] = -sineTheta;
                matrix[8] = sineTheta;
                matrix[10] = cosineTheta;
                break;
            case "Z":
                matrix[0] = cosineTheta;
                matrix[1] = sineTheta;
                matrix[4] = -sineTheta;
                matrix[5] = cosineTheta;
                break;
        }

        return matrix;
    }

    /**
     * @brief Creates a matrix that can be used to project a point on the Z plane
     * 
     * @param distance Distance between the object and plane of projection
     * 
     * @returns A projection matrix
     */
    static project(distance: number) {
        const matrix = new Matrix4();
        matrix.toIdentity()
        matrix[10] = 0;
        matrix[14] = 1.0 / distance;

        return matrix;
    }


    /**
     * 
     * @param target 
     * @returns 
     */
    static translate(target: Vector3) {
        const matrix = new Matrix4();
        matrix.toIdentity();
        matrix[12] = target.x;
        matrix[13] = target.y;
        matrix[14] = target.z;

        return matrix;
    }

    /**
     * 
     * @param scalar 
     * @returns 
     */
    static scale(scalar: Vector3) {
        const matrix = new Matrix4();
        matrix[0] = scalar.x;
        matrix[5] = scalar.y;
        matrix[10] = scalar.z;
        matrix[15] = 1;

        return matrix;
    }
}
