import { Scene, Cube, GLColor, Vector3 } from "./gl_tools/index.js";
// Control Variables
const RotationAxes = {
    X: 1,
    Y: 2,
    Z: 4
};
export class RotatingCubeScene extends Scene {
    constructor() {
        super(...arguments);
        // Scene Runtime Data
        this.currentRotation = RotationAxes.Y;
        this.degreesPerSecond = 360 / 3;
    }
    toggleXRotation() {
        if (this.currentRotation & RotationAxes.X) {
            this.currentRotation -= RotationAxes.X;
        }
        else {
            this.currentRotation += RotationAxes.X;
        }
    }
    toggleYRotation() {
        if (this.currentRotation & RotationAxes.Y) {
            this.currentRotation -= RotationAxes.Y;
        }
        else {
            this.currentRotation += RotationAxes.Y;
        }
    }
    toggleZRotation() {
        if (this.currentRotation & RotationAxes.Z) {
            this.currentRotation -= RotationAxes.Z;
        }
        else {
            this.currentRotation += RotationAxes.Z;
        }
    }
    init() {
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
        });
        this.instantiateObject("cube", "cube");
    }
    update(delta) {
        this.withObject("cube", (cube) => {
            cube.setRotation((rotation) => {
                if ((this.currentRotation & RotationAxes.X) !== 0)
                    rotation.x += (this.degreesPerSecond * delta);
                if ((this.currentRotation & RotationAxes.Y) !== 0)
                    rotation.y += (this.degreesPerSecond * delta);
                if ((this.currentRotation & RotationAxes.Z) !== 0)
                    rotation.z += (this.degreesPerSecond * delta);
                return rotation;
            });
        });
    }
    cleanup() {
        throw new Error("Method not implemented.");
    }
    requiredWebGLVersion() {
        return 1;
    }
}
