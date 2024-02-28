/**
 * Round a number to an amount of decimal places.
 * @param {number} value The number to round.
 * @param {number} decimals The number of decimal places to round; will round to nearest integer. Defaults to 4.
 * @returns {number} The number rounded to the decimal places.
 */
export function round(value, decimals = 4) {
    const decimalsInt = Math.round(decimals);
    const absDecimals = Math.abs(decimalsInt);
    const posExp = "e" + absDecimals;
    const negExp = "e-" + absDecimals;

    // NB exponential notation seems least prone to floating point errors
    /**
     * @param {string} expUp
     * @param {string} expDown
     */
    const roundWithExp = (expUp, expDown) =>
        Number(Math.round(value + expUp) + expDown);

    return decimalsInt >= 0
        ? roundWithExp(posExp, negExp)
        : roundWithExp(negExp, posExp);
}
