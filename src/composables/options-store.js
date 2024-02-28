import { readonly, ref } from "vue";
import { filterUndefinedProps } from "@/utils/object";
import { isNumber, isString, isUndefined } from "@/utils/type-checks";

const themeTypes = /** @type {const} */ (["auto", "light", "dark"]);
/**
 * @typedef {typeof themeTypes[number]} Theme
 */

/**
 * @typedef {Object} PartialOptions
 * @property {Theme} [theme] The app theme.
 * @property {string} [hoursSuffix] A suffix appended to hours results.
 * @property {string} [minutesSuffix] A suffix appended to minutes results.
 * @property {string} [secondsSuffix] A suffix appended to seconds results.
 * @property {number} [roundingDecimals] The number of decimals to round results to.
 */

const storageKeys = /** @type {const} */ ([
    "theme",
    "hoursSuffix",
    "minutesSuffix",
    "secondsSuffix",
    "roundingDecimals",
]);

/**
 * Default options to use for init, storage fetch, & reset.
 */
const defaultOptions = {
    /** @type {Theme} */
    theme: "auto",
    hoursSuffix: "hrs",
    minutesSuffix: "min",
    secondsSuffix: "sec",
    roundingDecimals: 4,
};

/** The app theme. */
const theme = ref(defaultOptions.theme);
/** A suffix appended to hours results. */
const hoursSuffix = ref(defaultOptions.hoursSuffix);
/** A suffix appended to minutes results. */
const minutesSuffix = ref(defaultOptions.minutesSuffix);
/** A suffix appended to seconds results. */
const secondsSuffix = ref(defaultOptions.secondsSuffix);
/** The number of decimals to round results to. */
const roundingDecimals = ref(defaultOptions.roundingDecimals);

/**
 * Update reactive options refs from object of optional properties.
 * @param {PartialOptions} options The options to update with. All properties are optional.
 */
function updateOptions(options) {
    if (!isUndefined(options.theme)) {
        if (themeTypes.includes(options.theme)) {
            theme.value = options.theme;
        } else {
            throw Error(`Failed to set theme: ${options.theme}`);
        }
    }

    if (!isUndefined(options.hoursSuffix)) {
        if (isString(options.hoursSuffix)) {
            hoursSuffix.value = options.hoursSuffix;
        } else {
            throw Error(`Failed to set hoursSuffix: ${options.hoursSuffix}`);
        }
    }

    if (!isUndefined(options.minutesSuffix)) {
        if (isString(options.minutesSuffix)) {
            minutesSuffix.value = options.minutesSuffix;
        } else {
            throw Error(
                `Failed to set minutesSuffix: ${options.minutesSuffix}`,
            );
        }
    }

    if (!isUndefined(options.secondsSuffix)) {
        if (isString(options.secondsSuffix)) {
            secondsSuffix.value = options.secondsSuffix;
        } else {
            throw Error(
                `Failed to set secondsSuffix: ${options.secondsSuffix}`,
            );
        }
    }

    if (!isUndefined(options.roundingDecimals)) {
        if (isNumber(options.roundingDecimals)) {
            roundingDecimals.value = options.roundingDecimals;
        } else {
            throw Error(
                `Failed to set roundingDecimals: ${options.roundingDecimals}`,
            );
        }
    }
}

/**
 * Async mutate options with object of optional properties.
 * @param {PartialOptions} options The options to mutate. All properties are optional.
 */
async function setOptions(options) {
    // push changes to storage; change listener should catch & update reactive objects
    await chrome.storage.sync.set(
        filterUndefinedProps({
            theme: options.theme,
            hoursSuffix: options.hoursSuffix,
            minutesSuffix: options.minutesSuffix,
            secondsSuffix: options.secondsSuffix,
            roundingDecimals: options.roundingDecimals,
        }),
    );
}

/**
 * Async mutate options by resetting to defaults.
 */
async function resetOptions() {
    // push change to storage; change listener should catch & update reactive objects
    await chrome.storage.sync.remove(storageKeys);
}

/**
 * A promise for the async initialization of options from storage.
 */
const initOptionsPromise = chrome.storage.sync
    .get(defaultOptions)
    .then(updateOptions);

// listen for updates to storage, then update reactive options
chrome.storage.sync.onChanged.addListener((changes) => {
    const newValues = Object.fromEntries(
        Object.entries(changes)
            .filter(([key]) => storageKeys.includes(key))
            .map(([key, change]) =>
                Object.hasOwn(change, "newValue")
                    ? [key, change.newValue]
                    : [key, defaultOptions[key]],
            ),
    );
    updateOptions(newValues);
});
// NB HMR updates in dev build don't clean old listeners

/**
 * Use the store of options.
 */
export function useOptionsStore() {
    return {
        /** The app theme. */
        theme: readonly(theme),
        /** A suffix appended to hours results. */
        hoursSuffix: readonly(hoursSuffix),
        /** A suffix appended to minutes results. */
        minutesSuffix: readonly(minutesSuffix),
        /** A suffix appended to seconds results. */
        secondsSuffix: readonly(secondsSuffix),
        /** The number of decimals to round results to. */
        roundingDecimals: readonly(roundingDecimals),
        initOptionsPromise,
        setOptions,
        resetOptions,
    };
}
