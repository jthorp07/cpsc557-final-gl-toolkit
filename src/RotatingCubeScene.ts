/**
 * @file RotatingCubeScene.ts
 * 
 * @brief A scene demonstrating a rotating cube with user controls.
 */

import { Scene, Cube, GLVersion, GLColor, Vector3, Transform, Plane, RectangularPyramid } from "./gl_tools/index.js";

// Control Variables
const RotationAxes = {
    X: 1,
    Y: 1 << 1,
    Z: 1 << 2,
} as const;

const CameraMoveDirections = {
    Forward: 1,
    Backward: 1 << 1,
    Left: 1 << 2,
    Right: 1 << 3
} as const;
const CAMERA_VELOCITY = 1.2 as const;

/**
 * @class RotatingCubeScene
 * 
 * @brief A concrete scene implementation showing a rotating colored cube.
 */
export class RotatingCubeScene extends Scene {

    // Cube Animation Data
    private currentRotation = RotationAxes.Y;
    private radiansPerSecond = Transform.degreesToRadians(360 / 3);

    // Camera Animation Data
    private cameraMoveDirection = 0;
    private yaw = -90;
    private pitch = 0;
    private mouseSensitivity = 0.1;

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

    private setupInput() {

        // WASD Movement
        document.addEventListener("keydown", (event) => {
            switch (event.key.toLowerCase()) {
                case "w":
                    this.cameraMoveDirection |= CameraMoveDirections.Forward; 
                    break;
                case "s":
                    this.cameraMoveDirection |= CameraMoveDirections.Backward; 
                    break;
                case "a":
                    this.cameraMoveDirection |= CameraMoveDirections.Left; 
                    break;
                case "d":
                    this.cameraMoveDirection |= CameraMoveDirections.Right; 
                    break;
            }
        });
        document.addEventListener("keyup", (event) => {
            switch (event.key.toLowerCase()) {
                case "w":
                    this.cameraMoveDirection &= ~CameraMoveDirections.Forward; 
                    break;
                case "s":
                    this.cameraMoveDirection &= ~CameraMoveDirections.Backward; 
                    break;
                case "a":
                    this.cameraMoveDirection &= ~CameraMoveDirections.Left; 
                    break;
                case "d":
                    this.cameraMoveDirection &= ~CameraMoveDirections.Right; 
                    break;
            }
        });

        // Lock mouse when canvas focused
        const canvas = document.querySelector("canvas");
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
        }

        // Update pitch and yaw on mouse movement while canvas focused
        document.addEventListener("mousemove", (event) => {
            if (document.pointerLockElement === canvas) {
                this.yaw += event.movementX * this.mouseSensitivity;
                this.pitch -= event.movementY * this.mouseSensitivity;
                if (this.pitch > 89) this.pitch = 89;
                if (this.pitch < -89) this.pitch = -89;
            }
        });
    }

    /**
     * @brief Initializes the scene, camera, and shapes.
     */
    init(): void {
    
        // Setup movement and look controls
        this.setupInput();

        // Move Camera Back Initially
        this.withCamera((camera) => {
            camera.move(new Vector3(0, 0, 3));
        });

        // Create Cube
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

        // Create Pyramid
        this.registerShape("pyramid", new RectangularPyramid(1, 1, 1));
        this.withShape("pyramid", (pyramid) => {
            pyramid.staticTranslate(Vector3.NormalY.negated(true));
            pyramid.setColor(GLColor.Black);
        });
        this.instantiateObject("pyramid", "pyramid");

        // Create Floor Plane
        this.registerShape("floor", Plane.makeYPlane(10, 10));
        this.withShape("floor", (floor) => {
            floor.setColor(GLColor.White);
            floor.staticTranslate(new Vector3(0, -1, 0));
        });
        this.instantiateObject("floor", "floor");

        // Create Wall Planes
        this.registerShape("neg_z_wall", Plane.makeZPlane(10, 3));
        this.withShape("neg_z_wall", (wall) => {
            wall.setColor(GLColor.White);
            wall.staticTranslate(new Vector3(0, 0, -5));
        });
        this.instantiateObject("neg_z_wall", "neg_z_wall");
        this.registerShape("pos_z_wall", Plane.makeZPlane(10, 3));
        this.withShape("pos_z_wall", (wall) => {
            wall.setColor(GLColor.White);
            wall.staticTranslate(new Vector3(0, 0, 5));
        });
        this.instantiateObject("pos_z_wall", "pos_z_wall");
        this.registerShape("neg_x_wall", Plane.makeXPlane(10, 3));
        this.withShape("neg_x_wall", (wall) => {
            wall.setColor(GLColor.White);
            wall.staticTranslate(new Vector3(-5, 0, 0));
        });
        this.instantiateObject("neg_x_wall", "neg_x_wall");
        this.registerShape("pos_x_wall", Plane.makeXPlane(10, 3));
        this.withShape("pos_x_wall", (wall) => {
            wall.setColor(GLColor.White);
            wall.staticTranslate(new Vector3(5, 0, 0));
        });
        this.instantiateObject("pos_x_wall", "pos_x_wall");
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
        });

        this.processMoveCamera(delta);
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

    private processMoveCamera(delta: number) {
        this.withCamera((camera) => {
            // Calculate Look Direction
            const yawRadians = Transform.degreesToRadians(this.yaw);
            const pitchRadians = Transform.degreesToRadians(this.pitch);

            const lookDirection = new Vector3(
                Math.cos(yawRadians) * Math.cos(pitchRadians),
                Math.sin(pitchRadians),
                Math.sin(yawRadians) * Math.cos(pitchRadians)
            ).normalized(true);

            // Calculate Movement Vectors (XZ plane only)
            const moveForward = new Vector3(Math.cos(yawRadians), 0, Math.sin(yawRadians)).normalized(true);
            const moveRight = moveForward.cross(Vector3.NormalY).normalized(true);

            const movement = new Vector3();

            if (this.cameraMoveDirection & CameraMoveDirections.Forward) movement.add(moveForward, true);
            if (this.cameraMoveDirection & CameraMoveDirections.Backward) movement.subtract(moveForward, true);
            if (this.cameraMoveDirection & CameraMoveDirections.Right) movement.add(moveRight, true);
            if (this.cameraMoveDirection & CameraMoveDirections.Left) movement.subtract(moveRight, true);

            if (movement.magnitude() > 0) {
                movement.normalized(true).scaled(CAMERA_VELOCITY * delta, true);
                camera.move(movement);
            }

            // Update Camera Target
            camera.lookAt(camera.position.add(lookDirection));
        });
    }
}
