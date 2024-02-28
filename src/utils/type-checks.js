/**
 * @returns {value is undefined}
 */
export function isUndefined(value) {
    return value === undefined;
}

/**
 * @returns {value is null}
 */
export function isNull(value) {
    return value === null;
}

/**
 * @returns {value is string}
 */
export function isString(value) {
    return typeof value === "string";
}

/**
 * @returns {value is number}
 */
export function isNumber(value) {
    return typeof value === "number";
}
