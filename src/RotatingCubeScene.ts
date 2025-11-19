/**
 * @file RotatingCubeScene.ts
 * 
 * @brief A scene demonstrating a rotating cube with user controls.
 */

import { Scene, Cube, GLVersion, GLColor, Vector3, Transform } from "./gl_tools/index.js";

// Control Variables
const RotationAxes = {
    X: 1,
    Y: 2,
    Z: 4
} as const;

/**
 * @class RotatingCubeScene
 * 
 * @brief A concrete scene implementation showing a rotating colored cube.
 */
export class RotatingCubeScene extends Scene {

    // Scene Runtime Data
    private currentRotation = RotationAxes.Y;
    private radiansPerSecond = Transform.degreesToRadians(360 / 3);

    /**
     * @brief Toggles rotation around the X axis.
     */
    toggleXRotation() {
        if (this.currentRotation & RotationAxes.X) {
            this.currentRotation -= RotationAxes.X;
        } else {
            this.currentRotation += RotationAxes.X;
        }
    }

    /**
     * @brief Toggles rotation around the Y axis.
     */
    toggleYRotation() {
        if (this.currentRotation & RotationAxes.Y) {
            this.currentRotation -= RotationAxes.Y;
        } else {
            this.currentRotation += RotationAxes.Y;
        }
    }

    /**
     * @brief Toggles rotation around the Z axis.
     */
    toggleZRotation() {
        if (this.currentRotation & RotationAxes.Z) {
            this.currentRotation -= RotationAxes.Z;
        } else {
            this.currentRotation += RotationAxes.Z;
        }
    }

    /**
     * @brief Initializes the scene, camera, and shapes.
     */
    init(): void {
        this.withCamera((camera) => {
            camera.move(new Vector3(0, 0, 3));
        });
        this.registerShape("cube", new Cube());
        this.withShape("cube", (cube) => {
            cube.setVertexColors([
                GLColor.Black,
                GLColor.Red,
                GLColor.Yellow,
                GLColor.Green,
                GLColor.Blue,
                GLColor.Magenta,
                GLColor.White,
                GLColor.Cyan,
            ]);
        })
        this.instantiateObject("cube", "cube");
    }

    /**
     * @brief Updates the scene state.
     * 
     * @param delta Time elapsed since last frame in seconds.
     */
    protected update(delta: number): void {
        this.withObject("cube", (cube) => {
            cube.setRotation((rotation) => {
                if ((this.currentRotation & RotationAxes.X) !== 0) rotation.x += (this.radiansPerSecond * delta);
                if ((this.currentRotation & RotationAxes.Y) !== 0) rotation.y += (this.radiansPerSecond * delta);
                if ((this.currentRotation & RotationAxes.Z) !== 0) rotation.z += (this.radiansPerSecond * delta);
                return rotation;
            });
        })
    }

    /**
     * @brief Cleans up scene resources.
     */
    protected cleanup(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * @brief Specifies the required WebGL version.
     * 
     * @returns The required WebGL version (1 or 2).
     */
    requiredWebGLVersion(): GLVersion | undefined {
        return 1;
    }
}
