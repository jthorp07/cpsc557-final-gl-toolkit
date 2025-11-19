/**
 * @file PageStyle.ts
 * 
 * @brief Sets up page style controls
 */

import { assertNarrowableTo } from "./gl_tools";

const THEME_TOGGLE_INPUT = "themeToggle" as const;
const ROTATE_X_ID = "rotateXButton" as const;
const ROTATE_Y_ID = "rotateYButton" as const;
const ROTATE_Z_ID = "rotateZButton" as const;

const DARK_THEME_CLASS = "dark" as const;
const ACTIVE_CLASS = "active" as const;

export function initializePageStyleConstrols() {

    // Theme Toggle
    const themeToggle = document.getElementById(THEME_TOGGLE_INPUT);
    assertNarrowableTo(
        themeToggle,
        (element) => (element instanceof HTMLInputElement),
        "Expected element themeToggle to be an HTMLInputElement"
    );
    themeToggle.checked = document.body.classList.contains(DARK_THEME_CLASS);
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.add(DARK_THEME_CLASS);
        } else {
            document.body.classList.remove(DARK_THEME_CLASS);
        }
    });

    // Rotation Button Toggles
    const rotateX = document.getElementById(ROTATE_X_ID);
    if (!(rotateX instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_X_ID} is not a button`);
        return;
    }
    rotateX.addEventListener("click", () => {
        rotateX.classList.toggle(ACTIVE_CLASS);
    });
    const rotateY = document.getElementById(ROTATE_Y_ID);
    if (!(rotateY instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_Y_ID} is not a button`);
        return;
    }
    rotateY.classList.add(ACTIVE_CLASS);
    rotateY.addEventListener("click", () => {
        rotateY.classList.toggle(ACTIVE_CLASS);
    });
    const rotateZ = document.getElementById(ROTATE_Z_ID);
    if (!(rotateZ instanceof HTMLButtonElement)) {
        alert(`Error: Element ${ROTATE_Z_ID} is not a button`);
        return;
    }
    rotateZ.addEventListener("click", () => {
        rotateZ.classList.toggle(ACTIVE_CLASS);
    });
}
