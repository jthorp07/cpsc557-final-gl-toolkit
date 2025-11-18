/**
 * @file RenderLoop.ts
 * 
 * @brief Runner for a render loop
 */

import { GLContext } from "../GL/GLContext.js";
import { assertNotUndefined } from "./Assert.js";
import { Scene } from "./Scene.js";

export class GLApp {

    scene: Scene;
    running: boolean;
    requestAnimationFrameId: number | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.running = false;
    }

    /**
     * @brief Initializes and starts running this loop's scene
     */
    start(canvas: HTMLCanvasElement) {

        if (this.running) return;

        // Initialize WebGL Context
        console.log("GLApp: Initialize WebGL");
        const requiredVersion = this.scene.requiredWebGLVersion();
        const context = GLContext.initializeWithContext(canvas, { version: requiredVersion });
        assertNotUndefined(context);

        // Initialize scene and render loop
        console.log("GLApp: Initialize Scene");
        this.scene.context = context;
        this.scene.initialize(context);
        this.running = true;
        const tick = (time: number) => {
            if (!this.running) return;
            this.scene.renderFrame(time);
            this.requestAnimationFrameId = requestAnimationFrame(tick);
        };

        // Start render loop
        console.log("GLApp: Start Render Loop")
        this.requestAnimationFrameId = requestAnimationFrame(tick);
    }

    /**
     * @brief Stops running this loop's scene and cleans up scene resources
     */
    stop() {
        this.running = false;
        if (this.requestAnimationFrameId != null) {
            cancelAnimationFrame(this.requestAnimationFrameId);
            this.requestAnimationFrameId = null;
        }
        this.scene.dispose();
    }
}
