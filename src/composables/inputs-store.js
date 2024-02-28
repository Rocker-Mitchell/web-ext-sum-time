import { ref, readonly } from "vue";
import { isUndefined, isNumber } from "@/utils/type-checks";

const defaultValues = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    divide: 1,
};

const hours = ref(defaultValues.hours);
const minutes = ref(defaultValues.minutes);
const seconds = ref(defaultValues.seconds);
const divide = ref(defaultValues.divide);

/**
 * Mutate inputs with object of optional properties.
 * @param {Object} inputs The inputs to mutate. All properties are optional.
 * @param {number} [inputs.hours] Mutate input hours. Must be greater than or equal to 0.
 * @param {number} [inputs.minutes] Mutate input minutes. Must be greater than or equal to 0.
 * @param {number} [inputs.seconds] Mutate input seconds. Must be greater than or equal to 0.
 * @param {number} [inputs.divide] Mutate input divisor. Must be greater than 0.
 */
function setInputs(inputs) {
    if (!isUndefined(inputs.hours)) {
        if (isNumber(inputs.hours) && inputs.hours >= 0) {
            hours.value = inputs.hours;
        } else {
            throw Error(`Failed to set hours: ${inputs.hours}`);
        }
    }

    if (!isUndefined(inputs.minutes)) {
        if (isNumber(inputs.minutes) && inputs.minutes >= 0) {
            minutes.value = inputs.minutes;
        } else {
            throw Error(`Failed to set minutes: ${inputs.minutes}`);
        }
    }

    if (!isUndefined(inputs.seconds)) {
        if (isNumber(inputs.seconds) && inputs.seconds >= 0) {
            seconds.value = inputs.seconds;
        } else {
            throw Error(`Failed to set seconds: ${inputs.seconds}`);
        }
    }

    if (!isUndefined(inputs.divide)) {
        if (isNumber(inputs.divide) && inputs.divide > 0) {
            divide.value = inputs.divide;
        } else {
            throw Error(`Failed to set divide: ${inputs.divide}`);
        }
    }
}

function resetInputs() {
    setInputs(defaultValues);
}

/**
 * Use the store of inputs.
 */
export function useInputsStore() {
    return {
        hours: readonly(hours),
        minutes: readonly(minutes),
        seconds: readonly(seconds),
        divide: readonly(divide),
        setInputs,
        resetInputs,
    };
}
