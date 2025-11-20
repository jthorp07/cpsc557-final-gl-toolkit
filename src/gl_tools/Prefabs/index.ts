/**
 * @module Prefabs
 * 
 * @brief Factory classes for simple geometric primitives so that
 *        simple shapes do not need to be manually constructed from
 *        vertices and shader attribute data.
 */

export { BaseShape, Box, Cube, Sphere, Plane, RectangularPyramid } from "./Shapes/index.js";
export { GLColor, BaseTexture, SolidColorTexture, PerVertexColorTexture } from "./Textures/index.js";
