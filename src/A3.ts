/**
 * @file A3.ts
 * 
 * @brief Main entry point for Assignment 3.
 */

import { GLApp } from "./gl_tools/index.js";
import { RotatingCubeScene } from "./RotatingCubeScene.js";
import { initializePageStyleConstrols } from "./PageStyle.js";

// Relevant Elements
const CANVAS_ELEMENT_ID = "glTarget" as const;
const ROTATE_X_ID = "rotateXButton" as const;
const ROTATE_Y_ID = "rotateYButton" as const;
const ROTATE_Z_ID = "rotateZButton" as const;
const DOWNLOAD_VERTEX_SHADER = "downloadVertexShader" as const;
const DOWNLOAD_FRAGMENT_SHADER = "downloadFragmentShader" as const;

window.onload = async () => {

    initializePageStyleConstrols();

    // Initialize Scene and App
    const scene = new RotatingCubeScene();
    const canvas = document.getElementById(CANVAS_ELEMENT_ID);
    if (!(canvas instanceof HTMLCanvasElement)) {
        alert(`Error: Element ${CANVAS_ELEMENT_ID} is not a canvas`);
        return;
    }
    const app = new GLApp(scene);

    // Initialize Scene Controls
    const rotateX = document.getElementById(ROTATE_X_ID);
    if (!(rotateX instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_X_ID} is not a button`);
        return;
    }
    rotateX.addEventListener("click", scene.toggleXRotation.bind(scene));
    const rotateY = document.getElementById(ROTATE_Y_ID);
    if (!(rotateY instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_Y_ID} is not a button`);
        return;
    }
    rotateY.addEventListener("click", scene.toggleYRotation.bind(scene));
    const rotateZ = document.getElementById(ROTATE_Z_ID);
    if (!(rotateZ instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_Z_ID} is not a button`);
        return;
    }
    rotateZ.addEventListener("click", scene.toggleZRotation.bind(scene));
    const downloadVertexShader = document.getElementById(DOWNLOAD_VERTEX_SHADER);
    if (!(downloadVertexShader instanceof HTMLButtonElement)) {
        alert(`Error: Element ${DOWNLOAD_VERTEX_SHADER} is not a button`);
        return;
    }
    downloadVertexShader.addEventListener("click", () => {
        const vertexShader = scene.vertexShaderUrl;
        if (!vertexShader) {
            alert("Error: Vertex shader URL not found");
            return;
        }
        const link = document.createElement("a");
        link.href = vertexShader;
        link.download = "vertexShader.glsl";
        link.click();
    });
    const downloadFragmentShader = document.getElementById(DOWNLOAD_FRAGMENT_SHADER);
    if (!(downloadFragmentShader instanceof HTMLButtonElement)) {
        alert(`Error: Element ${DOWNLOAD_FRAGMENT_SHADER} is not a button`);
        return;
    }
    downloadFragmentShader.addEventListener("click", () => {
        const fragmentShader = scene.fragmentShaderUrl;
        if (!fragmentShader) {
            alert("Error: Fragment shader URL not found");
            return;
        }
        const link = document.createElement("a");
        link.href = fragmentShader;
        link.download = "fragmentShader.glsl";
        link.click();
    });

    app.start(canvas);
}
