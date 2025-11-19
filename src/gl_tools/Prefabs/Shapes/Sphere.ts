/**
 * @file Sphere.ts
 * 
 * @brief Defines the Sphere class, which contains the topology of a sphere and
 *        allows instantiation of renderable spheres for a scene.
 */

import { BaseShape } from "./Shape.js";

/**
 * @class Sphere
 * 
 * @brief A spherical shape
 */
export class Sphere extends BaseShape {

    /**
     * @brief Creates a new Sphere
     * 
     * @param radius Radius of the sphere
     */
    constructor(radius: number = 1.0) {
        /**
         * @todo impl
         */
        super([], [], [], []);
    }
}
