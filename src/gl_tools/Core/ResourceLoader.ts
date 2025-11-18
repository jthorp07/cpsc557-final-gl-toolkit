/**
 * @file ResourceLoader.ts
 * 
 * @brief Functions that load various resources used in WebGL programs
 */

import { assertNarrowableTo } from "./Assert.js";

export class ResourceLoader {

    /**
     * @brief Fetches text from a source
     * 
     * @param source Source to fetch shader text from
     * @param sourceType Type of source the shader text resides in
     * @returns Shader text
     */
    static async loadShaderContent(source: string, sourceType: "ScriptElement" | "GLSLFile" | "URL") {

        switch (sourceType) {
            case "ScriptElement":
                const scriptElement = document.getElementById(source);
                assertNarrowableTo<HTMLElement|null, HTMLScriptElement>(
                    scriptElement,
                    (val: HTMLElement|null): val is HTMLScriptElement => {
                        return (val != null) && (val instanceof HTMLScriptElement);
                    },
                    `Element ID ${source} does not exist or is not a script`
                );
                return scriptElement.text;
            case "GLSLFile":
                const localFileUrl = new URL(source, import.meta.url).href;
                return await this.safeFetch(localFileUrl);
            case "URL":
                return await this.safeFetch(source);
        }
    }

    static async safeFetch(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) return;
            return await response.text();
        } catch (error) {
            console.error(`Failed to fetch ${url}`);
            return;
        }
    }
}