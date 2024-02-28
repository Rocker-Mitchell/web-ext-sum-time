<script setup>
import { onMounted, ref } from "vue";
import PicoField from "@/components/PicoField.vue";
import ValidatingInput from "@/components/ValidatingInput.vue";
import { useInitialFormModel } from "@/composables/initial-form-model";
import { useInputsStore } from "@/composables/inputs-store";
import { useValidity } from "@/composables/validity";
import { isNumber, isUndefined } from "@/utils/type-checks";

const emit = defineEmits(["submit"]);

const inputsStore = useInputsStore();

const defaultValues = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    divide: 1,
};

const { formModel, resetFormModel } = useInitialFormModel({
    /** @type {string | number} */
    hours: "",
    /** @type {string | number} */
    minutes: "",
    /** @type {string | number} */
    seconds: "",
    /** @type {string | number} */
    divide: "",
});

const validityFields = {
    hours: useValidity(),
    minutes: useValidity(),
    seconds: useValidity(),
    divide: useValidity(),
};

const failedLastSubmission = ref(false);

/**
 * Evaluate if an invalid validity should be shown.
 * @param {import('@/composables/validity').Validity} validity The validity object to evaluate.
 */
function showInvalid(validity) {
    return failedLastSubmission.value && !validity.valid;
}

/**
 * Format a value for aria-invalid attribute.
 * @param {import('@/composables/validity').Validity} validity The validity object to format from.
 */
function ariaInvalidValue(validity) {
    // "true" to flag as invalid, don't add attribute otherwise
    return showInvalid(validity) ? "true" : null;
}

/**
 * Format helper text.
 * @param {import('@/composables/validity').Validity} validity The validity object to format from.
 * @param {Object} [details] Extra details to help format text.
 * @param {number} [details.min] The minimum range bound.
 */
function helperText(validity, details = {}) {
    if (!showInvalid(validity)) {
        return undefined;
    }

    if (validity.badInput) {
        return "Please enter a number.";
    } else if (validity.rangeUnderflow) {
        return isUndefined(details.min)
            ? "The number is below the minimum."
            : `The number must be greater than or equal to ${details.min}.`;
    } else if (validity.stepMismatch) {
        return "Must be a whole number.";
    } else {
        // fallback to original message
        return validity.message;
    }
}

/**
 * Get the form normalized to numbers, falling back to default values.
 * @returns {{[key in keyof typeof formModel]: number}} Form fields normalized to numbers.
 */
function normalizeForm() {
    return Object.fromEntries(
        Object.entries(formModel).map(([key, value]) => [
            key,
            isNumber(value) ? value : defaultValues[key],
        ]),
    );
}

/**
 * @param {SubmitEvent} event
 */
function onSubmit(event) {
    if (Object.values(validityFields).some(({ validity }) => !validity.valid)) {
        failedLastSubmission.value = true;
        event.target.reportValidity();
    } else {
        failedLastSubmission.value = false;
        inputsStore.setInputs(normalizeForm());
        emit("submit");
    }
}

function onReset() {
    resetFormModel();
}

onMounted(() => {
    // populate form from previous input
    if (inputsStore.hours.value != defaultValues.hours) {
        formModel.hours = inputsStore.hours.value;
    }
    if (inputsStore.minutes.value != defaultValues.minutes) {
        formModel.minutes = inputsStore.minutes.value;
    }
    if (inputsStore.seconds.value != defaultValues.seconds) {
        formModel.seconds = inputsStore.seconds.value;
    }
    if (inputsStore.divide.value != defaultValues.divide) {
        formModel.divide = inputsStore.divide.value;
    }
});
</script>

<template>
    <form novalidate @submit.prevent="onSubmit" @reset.prevent="onReset">
        <fieldset class="grid">
            <div>
                <PicoField
                    label-for="timesForm-hours"
                    label="Hours"
                    helper-id="timesForm-hours-helper"
                    :helper="
                        helperText(validityFields.hours.validity, {
                            min: 0,
                        })
                    "
                >
                    <ValidatingInput
                        id="timesForm-hours"
                        v-model.number="formModel.hours"
                        v-autofocus
                        name="hours"
                        type="number"
                        min="0"
                        step="any"
                        :placeholder="defaultValues.hours"
                        :aria-invalid="
                            ariaInvalidValue(validityFields.hours.validity)
                        "
                        aria-describedby="timesForm-hours-helper"
                        @validity="
                            (state, message) =>
                                validityFields.hours.updateValidity(
                                    state,
                                    message,
                                )
                        "
                    />
                </PicoField>
            </div>
            <div>
                <PicoField
                    label-for="timesForm-minutes"
                    label="Minutes"
                    helper-id="timesForm-minutes-helper"
                    :helper="
                        helperText(validityFields.minutes.validity, {
                            min: 0,
                        })
                    "
                >
                    <ValidatingInput
                        id="timesForm-minutes"
                        v-model.number="formModel.minutes"
                        name="minutes"
                        type="number"
                        min="0"
                        step="any"
                        :placeholder="defaultValues.minutes"
                        :aria-invalid="
                            ariaInvalidValue(validityFields.minutes.validity)
                        "
                        aria-describedby="timesForm-minutes-helper"
                        @validity="
                            (state, message) =>
                                validityFields.minutes.updateValidity(
                                    state,
                                    message,
                                )
                        "
                    />
                </PicoField>
            </div>
            <div>
                <PicoField
                    label-for="timesForm-seconds"
                    label="Seconds"
                    helper-id="timesForm-seconds-helper"
                    :helper="
                        helperText(validityFields.seconds.validity, {
                            min: 0,
                        })
                    "
                >
                    <ValidatingInput
                        id="timesForm-seconds"
                        v-model.number="formModel.seconds"
                        name="seconds"
                        type="number"
                        min="0"
                        step="any"
                        :placeholder="defaultValues.seconds"
                        :aria-invalid="
                            ariaInvalidValue(validityFields.seconds.validity)
                        "
                        aria-describedby="timesForm-seconds-helper"
                        @validity="
                            (state, message) =>
                                validityFields.seconds.updateValidity(
                                    state,
                                    message,
                                )
                        "
                    />
                </PicoField>
            </div>
        </fieldset>

        <PicoField
            label-for="timesForm-divide"
            label="Divide by"
            helper-id="timesForm-divide-helper"
            :helper="helperText(validityFields.divide.validity, { min: 1 })"
        >
            <ValidatingInput
                id="timesForm-divide"
                v-model.number="formModel.divide"
                name="divide"
                type="number"
                min="1"
                step="1"
                :placeholder="defaultValues.divide"
                :aria-invalid="ariaInvalidValue(validityFields.divide.validity)"
                aria-describedby="timesForm-divide-helper"
                @validity="
                    (state, message) =>
                        validityFields.divide.updateValidity(state, message)
                "
            />
        </PicoField>

        <div class="grid">
            <input type="submit" value="Sum Times" />
            <input type="reset" value="Clear" />
        </div>
    </form>
</template>
