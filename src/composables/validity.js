import { reactive, readonly } from "vue";

/**
 * @typedef {ReturnType<typeof useValidity>['validity']} Validity A validity object.
 */

/**
 * Create a reactive validity object with an updater.
 */
export function useValidity() {
    const validity = reactive({
        valid: true,
        badInput: false,
        rangeUnderflow: false,
        stepMismatch: false,
        message: "",
    });

    /**
     * Update the validity object from state & message.
     * @param {ValidityState} state An element validity state to update with.
     * @param {string} message A validation message to update with.
     */
    function updateValidity(state, message) {
        validity.valid = state.valid;
        validity.badInput = state.badInput;
        validity.rangeUnderflow = state.rangeUnderflow;
        validity.stepMismatch = state.stepMismatch;
        validity.message = message;
    }

    return {
        validity: readonly(validity),
        updateValidity,
    };
}
