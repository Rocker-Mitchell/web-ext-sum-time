import { reactive } from "vue";

/**
 * Create a reactive form model that can be reset.
 *
 * @template {Object.<string, *>} T
 * @param {T} init The initial form model data to start with and reset to.
 */
export function useInitialFormModel(init) {
    const initModel = { ...init };
    const formModel = reactive({ ...init });

    function resetFormModel() {
        for (const key in initModel) {
            formModel[key] = initModel[key];
        }
    }

    return {
        formModel,
        resetFormModel,
    };
}
