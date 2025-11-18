/**
 * @file Assert.ts
 *
 * @brief Exports type-narrowing assert functions and brand-restricted types to
 *        standardize type-narrowing related error handling.
 */
export function assertNotUndefined(value) {
    if (value === undefined)
        throw new Error(`Assertion Error: Received undefined value.`);
}
export function assertNotNull(value) {
    if (value === null)
        throw new Error(`Assertion Error: Received null value.`);
}
export function assertNarrowableTo(value, typeAssertion, message = "Received Non-Narrowable Parent Type") {
    if (!typeAssertion(value))
        throw new Error(`Assertion Error: ${message}`);
}
export function assert(value, message) {
    if (value)
        return;
    throw new Error(`Assertion Error${message ? `: ${message}` : ""}`);
}
export function isInteger(value) {
    return Number.isInteger(value);
}
export function isPositiveInteger(value) {
    if (typeof value === "number" && !isInteger(value))
        return false;
    return value >= 0;
}
