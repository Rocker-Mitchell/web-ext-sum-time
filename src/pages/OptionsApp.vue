<script setup>
import { computed, reactive, watchEffect } from "vue";
import AppNavbar from "@/components/AppNavbar.vue";
import PicoField from "@/components/PicoField.vue";
import ValidatingInput from "@/components/ValidatingInput.vue";
import { useOptionsStore } from "@/composables/options-store";
import { useValidity } from "@/composables/validity";

const optionsStore = useOptionsStore();

const themeModel = computed({
    get() {
        return optionsStore.theme.value;
    },
    set(theme) {
        optionsStore.setOptions({ theme });
    },
});

const formModel = reactive({
    hoursSuffix: optionsStore.hoursSuffix.value,
    minutesSuffix: optionsStore.minutesSuffix.value,
    secondsSuffix: optionsStore.secondsSuffix.value,
    roundingDecimals: optionsStore.roundingDecimals.value,
});

const formMatchesOptions = computed(
    () =>
        formModel.hoursSuffix === optionsStore.hoursSuffix.value &&
        formModel.minutesSuffix === optionsStore.minutesSuffix.value &&
        formModel.secondsSuffix === optionsStore.secondsSuffix.value &&
        formModel.roundingDecimals === optionsStore.roundingDecimals.value,
);

const validityFields = {
    roundingDecimals: useValidity(),
};

function syncOptionsStoreToForm() {
    formModel.hoursSuffix = optionsStore.hoursSuffix.value;
    formModel.minutesSuffix = optionsStore.minutesSuffix.value;
    formModel.secondsSuffix = optionsStore.secondsSuffix.value;
    formModel.roundingDecimals = optionsStore.roundingDecimals.value;
}

/**
 * Trim whitespace from form suffixes.
 */
function trimFormSuffixes() {
    formModel.hoursSuffix = formModel.hoursSuffix.trim();
    formModel.minutesSuffix = formModel.minutesSuffix.trim();
    formModel.secondsSuffix = formModel.secondsSuffix.trim();
}

/**
 * Format helper text.
 * @param {import('@/composables/validity').Validity} validity The validity object to format from.
 */
function helperText(validity) {
    if (validity.valid) {
        return undefined;
    }

    if (validity.badInput) {
        return "Please enter an number.";
    } else if (validity.stepMismatch) {
        return "Must be a whole number.";
    } else {
        // fallback to original message
        return validity.message;
    }
}

/**
 * @param {SubmitEvent} event
 */
function onFormSubmit(event) {
    if (Object.values(validityFields).some(({ validity }) => !validity.valid)) {
        event.target.reportValidity();
    } else {
        trimFormSuffixes();
        optionsStore.setOptions(formModel);
    }
}

function onFormReset() {
    syncOptionsStoreToForm();
}

/** On resetting to default options. */
function onResetDefault() {
    optionsStore.resetOptions();
    // NB need to sync form if options are already default but user changed the form
    syncOptionsStoreToForm();
}

// changes to options should be synced to form
watchEffect(() => syncOptionsStoreToForm());
</script>

<template>
    <header>
        <AppNavbar hide-options />
    </header>
    <main>
        <h2>Options</h2>

        <label for="options-themeSelect">Theme</label>
        <select id="options-themeSelect" v-model="themeModel">
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>

        <form @submit.prevent="onFormSubmit" @reset.prevent="onFormReset">
            <h3>Results Formatting</h3>

            <fieldset>
                <legend>Unit Suffixes</legend>

                <div class="grid">
                    <div>
                        <label for="optionsForm-hoursSuffix"> Hours </label>
                        <input
                            id="optionsForm-hoursSuffix"
                            v-model="formModel.hoursSuffix"
                            name="hoursSuffix"
                            type="text"
                        />
                    </div>

                    <div>
                        <label for="optionsForm-minutesSuffix"> Minutes </label>
                        <input
                            id="optionsForm-minutesSuffix"
                            v-model="formModel.minutesSuffix"
                            name="minutesSuffix"
                            type="text"
                        />
                    </div>

                    <div>
                        <label for="optionsForm-secondsSuffix"> Seconds </label>
                        <input
                            id="optionsForm-secondsSuffix"
                            v-model="formModel.secondsSuffix"
                            name="secondsSuffix"
                            type="text"
                        />
                    </div>
                </div>
            </fieldset>

            <PicoField
                label-for="optionsForm-roundingDecimals"
                label="Rounding Decimal Places"
                helper-id="optionsForm-roundingDecimals-helper"
                :helper="helperText(validityFields.roundingDecimals.validity)"
            >
                <ValidatingInput
                    id="optionsForm-roundingDecimals"
                    v-model.number="formModel.roundingDecimals"
                    name="roundingDecimals"
                    type="number"
                    step="1"
                    aria-describedby="optionsForm-roundingDecimals-helper"
                    :aria-invalid="
                        !validityFields.roundingDecimals.validity.valid
                            ? 'true'
                            : null
                    "
                    @validity="
                        (state, message) =>
                            validityFields.roundingDecimals.updateValidity(
                                state,
                                message,
                            )
                    "
                />
            </PicoField>

            <div v-if="!formMatchesOptions" class="grid">
                <input type="submit" value="Update" />
                <input type="reset" value="Cancel" />
            </div>
        </form>

        <hr />

        <input
            class="contrast"
            type="button"
            value="Reset to Default"
            @click="onResetDefault"
        />
    </main>
</template>
