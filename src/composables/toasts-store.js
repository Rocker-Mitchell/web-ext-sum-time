import { reactive, readonly } from "vue";

/**
 * @typedef {Object} Toast
 * @prop {number} id A unique ID for the toast.
 * @prop {string} message The toast message.
 * @prop {string | undefined} [variant] A variant class to apply to toast element.
 */

/** @type {Toast[]} */
const toasts = reactive([]);

let currentId = 0;

/**
 * Add a toast to show.
 * @param {Object} data The toast data.
 * @param {string} data.message The message of the toast.
 * @param {string | undefined} [data.variant] A variant class for toast element.
 * @param {number} timeout How long until the toast clears itself in milliseconds. 0 disables the timeout. Defaults to 3 seconds.
 * @returns {number} The ID of the created toast.
 */
function addToast({ message, variant }, timeout = 3000) {
    const toast = {
        id: currentId++,
        message,
        variant,
    };
    toasts.push(toast);

    if (timeout > 0) {
        setTimeout(() => {
            clearToast(toast.id);
        }, timeout);
    }

    return toast.id;
}

/**
 * Clear a toast from showing.
 * @param {number} id The id of the toast.
 */
function clearToast(id) {
    const index = toasts.findIndex((toast) => toast.id === id);
    toasts.splice(index, 1);
}

/**
 * Use the store of notifications/"toasts".
 */
export function useToastsStore() {
    return {
        toasts: readonly(toasts),
        addToast,
        clearToast,
    };
}
