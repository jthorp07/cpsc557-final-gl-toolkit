import { GLApp } from "./gl_tools/index.js";
import { RotatingCubeScene } from "./RotatingCubeScene.js";
// Relevant Elements
const CANVAS_ELEMENT_ID = "glTarget";
const ROTATE_X_ID = "rotateXButton";
const ROTATE_Y_ID = "rotateYButton";
const ROTATE_Z_ID = "rotateZButton";
const DOWNLOAD_VERTEX_SHADER = "downloadVertexShader";
const DOWNLOAD_FRAGMENT_SHADER = "downloadFragmentShader";
window.onload = async () => {
    // Initialize Scene and Attach Controls
    const scene = new RotatingCubeScene();
    const rotateX = document.getElementById(ROTATE_X_ID);
    if (!(rotateX instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_X_ID} is not a button`);
        return;
    }
    rotateX.onclick = scene.toggleXRotation.bind(scene);
    const rotateY = document.getElementById(ROTATE_Y_ID);
    if (!(rotateY instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_Y_ID} is not a button`);
        return;
    }
    rotateY.onclick = scene.toggleYRotation.bind(scene);
    const rotateZ = document.getElementById(ROTATE_Z_ID);
    if (!(rotateZ instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_Z_ID} is not a button`);
        return;
    }
    rotateZ.onclick = scene.toggleZRotation.bind(scene);
    // Initialize GL App
    const canvas = document.getElementById(CANVAS_ELEMENT_ID);
    if (!(canvas instanceof HTMLCanvasElement)) {
        alert(`Error: Element ${CANVAS_ELEMENT_ID} is not a canvas`);
        return;
    }
    const app = new GLApp(scene);
    app.start(canvas);
};
