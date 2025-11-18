/**
 * @file GenericVertexShader.ts
 * 
 * @brief A generic vertex shader usable by most small scenes
 */

import { GLVersion } from "../../types.js";
import { VertexShaderBuilder, VertexShaderMainBuilder } from "../builders/VertexShaderBuilder.js";
import {
    ArithmeticExpression, InvokationExpression,
    LiteralExpression, PropertyExpression, VariableExpression
} from "../language/GLSLGrammar.js";
import { PrimitiveLiteral } from "../language/PrimitiveLiteral.js";

class GenericVertexShaderBuilder extends VertexShaderBuilder {
    constructor(version: GLVersion) {
        super(version);

        // Add in/out params and uniforms
        this.addAttribute("vertexPosition", "vec3")
            .addAttribute("vertexNormal", "vec3")
            .addAttribute("textureCoordinate", "vec2")
            .addAttribute("vertexColor", "vec4")
            .addUniform("modelMatrix", "mat4")
            .addUniform("viewMatrix", "mat4")
            .addUniform("projectionMatrix", "mat4")
            .addUniform("normalMatrix", "mat3")
            .addVarying("fragmentPosition", "vec3")
            .addVarying("fragmentNormal", "vec3")
            .addVarying("fragmentTextureCoordinate", "vec2")
            .addVarying("fragmentColor", "vec4");

        const attributeVariables = this.attributes.map(attribute => {
            return new VariableExpression(attribute.type, attribute.name);
        });
        const varyingVariables = this.varyings.map(varying => {
            return new VariableExpression(varying.type, varying.name);
        });
        const uniformVariables = this.uniforms.map(uniform => {
            return new VariableExpression(uniform.type, uniform.name);
        })
        const globalVariables = attributeVariables.concat(varyingVariables).concat(uniformVariables);
        this.setMain(
                new VertexShaderMainBuilder(globalVariables).declareLocalVariable(
                    "vec4",
                    "worldPosition",
                    new ArithmeticExpression(
                        "vec4",
                        new VariableExpression("mat4", "modelMatrix"),
                        new InvokationExpression(
                            "vec4",
                            "vec4",
                            [
                                new VariableExpression("vec3", "vertexPosition"),
                                new LiteralExpression("float", PrimitiveLiteral.float(1.0))
                            ]
                        ),
                        "*"
                    )
                ).assignGLPosition(
                    new ArithmeticExpression(
                        "vec4",
                        new ArithmeticExpression(
                            "mat4",
                            new VariableExpression("mat4", "projectionMatrix"),
                            new VariableExpression("mat4", "viewMatrix"),
                            "*"
                        ),
                        new VariableExpression("vec4", "worldPosition"),
                        "*"
                    )
                ).assignVariable(
                    "fragmentPosition",
                    new InvokationExpression(
                        "vec3",
                        "vec3",
                        [
                            new PropertyExpression(
                                "vec3",
                                new VariableExpression(
                                    "vec4",
                                    "worldPosition"
                                ),
                                "xyz"
                            )
                        ],

                    )
                ).assignVariable(
                    "fragmentNormal",
                    new InvokationExpression(
                        "vec3",
                        "normalize",
                        [
                            new ArithmeticExpression(
                                "vec3",
                                new VariableExpression("mat3", "normalMatrix"),
                                new VariableExpression("vec3", "vertexNormal"),
                                "*"
                            )
                        ]
                    )
                ).assignVariable(
                    "fragmentTextureCoordinate",
                    new VariableExpression("vec2", "textureCoordinate")
                ).assignVariable(
                    "fragmentColor",
                    new VariableExpression("vec4", "vertexColor")
                )
            );
    }
}

export function makeGenericVertexShader(version: GLVersion) {
    return new GenericVertexShaderBuilder(version).build();
}
