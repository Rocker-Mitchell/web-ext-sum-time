import { isUndefined } from "@/utils/type-checks";

/**
 * Filter an object of undefined properties.
 * @param {Object.<string,*>} obj
 */
export function filterUndefinedProps(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => !isUndefined(value)),
    );
}
