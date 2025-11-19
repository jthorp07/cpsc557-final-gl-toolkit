/**
 * @file Assert.ts
 * 
 * @brief Exports type-narrowing assert functions and brand-restricted types to 
 *        standardize type-narrowing related error handling
 */

/**
 * @brief Asserts that a value is not undefined
 * 
 * @param value Value to check
 */
export function assertNotUndefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) throw new Error(`Assertion Error: Received undefined value.`);
}

/**
 * @brief Asserts that a value is not null
 * 
 * @param value Value to check
 */
export function assertNotNull<T>(value: T | null): asserts value is T {
    if (value === null) throw new Error(`Assertion Error: Received null value.`);
}

/**
 * @brief Asserts that a value can be narrowed to a specific type
 * 
 * @param value Value to check
 * @param typeAssertion Function that returns true if the value is of the target type
 * @param message Error message to display if assertion fails
 */
export function assertNarrowableTo<T, U extends T>(
    value: T,
    typeAssertion: (value: T) => value is U,
    message: string = "Received Non-Narrowable Parent Type"
): asserts value is U {
    if (!typeAssertion(value)) throw new Error(`Assertion Error: ${message}`);
}

/**
 * @brief General assertion function
 * 
 * @param value Condition to check
 * @param message Error message to display if assertion fails
 */
export function assert(value: boolean, message?: string) {
    if (value) return;
    throw new Error(`Assertion Error${message ? `: ${message}` : ""}`);
}

export type integer = number & { __brand: "integer" };

export type positive_integer = integer & { __brand: "positive_integer" };

/**
 * @brief Checks if a number is an integer
 * 
 * @param value Number to check
 * @returns True if the number is an integer
 */
export function isInteger(value: number): value is integer {
    return Number.isInteger(value);
}

/**
 * @brief Checks if a number is a positive integer
 * 
 * @param value Number to check
 * @returns True if the number is a positive integer
 */
export function isPositiveInteger(value: number | integer): value is positive_integer {
    if (typeof value === "number" && !isInteger(value)) return false;
    return value >= 0;
}
