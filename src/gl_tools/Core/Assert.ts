/**
 * @file Assert.ts
 * 
 * @brief Exports type-narrowing assert functions and brand-restricted types to 
 *        standardize type-narrowing related error handling.
 */

export function assertNotUndefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) throw new Error(`Assertion Error: Received undefined value.`);
}

export function assertNotNull<T>(value: T | null): asserts value is T {
    if (value === null) throw new Error(`Assertion Error: Received null value.`);
}

export function assertNarrowableTo<T, U extends T>(
    value: T,
    typeAssertion: (value: T) => value is U,
    message: string = "Received Non-Narrowable Parent Type"
): asserts value is U {
    if (!typeAssertion(value)) throw new Error(`Assertion Error: ${message}`);
}

export function assert(value: boolean, message?: string) {
    if (value) return;
    throw new Error(`Assertion Error${message ? `: ${message}` : ""}`);
}

export type integer = number & { __brand: "integer" };

export type positive_integer = integer & { __brand: "positive_integer" };

export function isInteger(value: number): value is integer {
    return Number.isInteger(value);
}

export function isPositiveInteger(value: number | integer): value is positive_integer {
    if (typeof value === "number" && !isInteger(value)) return false;
    return value >= 0;
}
