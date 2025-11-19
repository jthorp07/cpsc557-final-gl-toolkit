/**
 * @file GenericFragmentShader.ts
 * 
 * @brief A generic fragment shader usable by most small scenes
 */

import { GLVersion } from "../../types.js";
import { FragmentShaderBuilder, FragmentShaderMainBuilder } from "../builders/FragmentShaderBuilder.js";
import {
    ArithmeticExpression, AssignmentStatement, BooleanExpression, IfStatement, InvokationExpression,
    LiteralExpression, PropertyExpression, VariableExpression
} from "../language/GLSLGrammar.js";
import { PrimitiveLiteral } from "../language/PrimitiveLiteral.js";

/**
 * @class GenericFragmentShaderBuilder
 * 
 * @brief Builder for the generic fragment shader
 */
class GenericFragmentShaderBuilder extends FragmentShaderBuilder {
    /**
     * @brief Creates a new GenericFragmentShaderBuilder
     * 
     * @param version GLSL version
     */
    constructor(version: GLVersion) {
        super(version);
        this.addPrecisionStatement("mediump", "float")
            .addVarying("fragmentPosition", "vec3")
            .addVarying("fragmentNormal", "vec3")
            .addVarying("fragmentTextureCoordinate", "vec2")
            .addVarying("fragmentColor", "vec4")
            .addUniform("lightPosition", "vec3")
            .addUniform("lightColor", "vec3")
            .addUniform("cameraPosition", "vec3")
            .addUniform("objectColor", "vec4")
            .addUniform("shininess", "float")
            .addUniform("useTexture", "bool")
            .addUniform("useVertexColor", "bool")
            .addUniform("globalAlpha", "float")
            .addUniform("textureSampler", "sampler2D");

        const varyingVariables = this.varyings.map(varying => {
            return new VariableExpression(varying.type, varying.name);
        });
        const uniformVariables = this.uniforms.map(uniform => {
            return new VariableExpression(uniform.type, uniform.name);
        });
        const globalVariables = varyingVariables.concat(uniformVariables);

        this.setMain(
            new FragmentShaderMainBuilder(globalVariables, 1)
                .declareLocalVariable(
                    "vec4",
                    "baseColor"
                ).addIf(
                    new IfStatement(
                        [
                            [
                                new BooleanExpression(
                                    new VariableExpression("bool", "useVertexColor")
                                ),
                                [
                                    new AssignmentStatement(
                                        new VariableExpression("vec4", "baseColor"),
                                        new VariableExpression("vec4", "fragmentColor")
                                    )
                                ]
                            ],
                            [
                                new BooleanExpression(
                                    new VariableExpression("bool", "useTexture")
                                ),
                                [
                                    new AssignmentStatement(
                                        new VariableExpression("vec4", "baseColor"),
                                        new InvokationExpression(
                                            "vec4",
                                            this.version === 1 ? "texture2D" : "texture",
                                            [
                                                new VariableExpression("sampler2D", "textureSampler"),
                                                new VariableExpression("vec2", "fragmentTextureCoordinate")
                                            ]
                                        )
                                    )
                                ]
                            ]
                        ],
                        [
                            new AssignmentStatement(
                                new VariableExpression("vec4", "baseColor"),
                                new VariableExpression("vec4", "objectColor"),
                            )
                        ]
                    )
                ).declareLocalVariable(
                    "vec3",
                    "normalizedNormal",
                    new InvokationExpression(
                        "vec3",
                        "normalize",
                        [new VariableExpression("vec3", "fragmentNormal")]
                    )
                ).declareLocalVariable(
                    "float",
                    "ambientStrength",
                    new LiteralExpression("float", PrimitiveLiteral.float(0.15))
                ).declareLocalVariable(
                    "vec3",
                    "ambientColor",
                    new ArithmeticExpression(
                        "vec3",
                        new VariableExpression("vec3", "lightColor"),
                        new VariableExpression("float", "ambientStrength"),
                        "*"
                    )
                ).declareLocalVariable(
                    "vec3",
                    "lightDirection",
                    new InvokationExpression(
                        "vec3",
                        "normalize",
                        [
                            new ArithmeticExpression(
                                "vec3",
                                new VariableExpression("vec3", "lightPosition"),
                                new VariableExpression("vec3", "fragmentPosition"),
                                "-"
                            )
                        ]
                    )
                ).declareLocalVariable(
                    "float",
                    "diffuseStrength",
                    new InvokationExpression(
                        "float",
                        "max",
                        [
                            new InvokationExpression(
                                "float",
                                "dot",
                                [
                                    new VariableExpression("vec3", "normalizedNormal"),
                                    new VariableExpression("vec3", "lightDirection")
                                ]
                            ),
                            new LiteralExpression("float", PrimitiveLiteral.float(0.0))
                        ]
                    )
                ).declareLocalVariable(
                    "vec3",
                    "diffuseColor",
                    new ArithmeticExpression(
                        "vec3",
                        new VariableExpression("vec3", "lightColor"),
                        new VariableExpression("float", "diffuseStrength"),
                        "*"
                    )
                ).declareLocalVariable(
                    "vec3",
                    "viewDirection",
                    new InvokationExpression(
                        "vec3",
                        "normalize",
                        [
                            new ArithmeticExpression(
                                "vec3",
                                new VariableExpression("vec3", "cameraPosition"),
                                new VariableExpression("vec3", "fragmentPosition"),
                                "-"
                            )
                        ]
                    )
                ).declareLocalVariable(
                    "vec3",
                    "halfwayDirection",
                    new InvokationExpression(
                        "vec3",
                        "normalize",
                        [
                            new ArithmeticExpression(
                                "vec3",
                                new VariableExpression("vec3", "lightPosition"),
                                new VariableExpression("vec3", "viewDirection"),
                                "+"
                            )
                        ]
                    )
                ).declareLocalVariable(
                    "float",
                    "specularStrength",
                    new InvokationExpression(
                        "float",
                        "pow",
                        [
                            new InvokationExpression(
                                "float",
                                "max",
                                [
                                    new InvokationExpression(
                                        "float",
                                        "dot",
                                        [
                                            new VariableExpression("vec3", "normalizedNormal"),
                                            new VariableExpression("vec3", "halfwayDirection")
                                        ]
                                    ),
                                    new LiteralExpression("float", PrimitiveLiteral.float(0.0)),
                                ]
                            ),
                            new VariableExpression("float", "shininess")
                        ]
                    )
                ).declareLocalVariable(
                    "vec3",
                    "specularColor",
                    new ArithmeticExpression(
                        "vec3",
                        new VariableExpression("vec3", "lightColor"),
                        new VariableExpression("float", "specularStrength"),
                        "*"
                    )
                ).declareLocalVariable(
                    "vec3",
                    "finalColor",
                    new ArithmeticExpression(
                        "vec3",
                        new ArithmeticExpression(
                            "vec3",
                            new ArithmeticExpression(
                                "vec3",
                                new VariableExpression("vec3", "ambientColor"),
                                new VariableExpression("vec3", "diffuseColor"),
                                "+"
                            ),
                            new VariableExpression("vec3", "specularColor"),
                            "+"
                        ),
                        new PropertyExpression(
                            "vec3",
                            new VariableExpression("vec4", "baseColor"),
                            "rgb"
                        ),
                        "*"
                    )
                ).assignGLFragColor(
                    new InvokationExpression(
                        "vec4",
                        "vec4",
                        [
                            new VariableExpression("vec3", "finalColor"),
                            new ArithmeticExpression(
                                "float",
                                new PropertyExpression(
                                    "float",
                                    new VariableExpression("vec4", "baseColor"),
                                    "a"
                                ),
                                new VariableExpression("float", "globalAlpha"),
                                "*"
                            )
                        ]
                    )
                )
        )
    }
}

/**
 * @brief Creates a generic fragment shader
 * 
 * @param version GLSL version
 * @returns The created Shader object
 */
export function makeGenericFragmentShader(version: GLVersion) {
    return new GenericFragmentShaderBuilder(version).build();
}
