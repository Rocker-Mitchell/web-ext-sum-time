/**
 * Custom directive to focus an element on mount.
 * @type {import("vue").ObjectDirective<HTMLElement, boolean>}
 */
export const vAutofocus = {
    mounted: (el, { value = true }) => {
        // allow components to disable focus on mount via passed value
        if (value) {
            el.focus();
        }
    },
};
