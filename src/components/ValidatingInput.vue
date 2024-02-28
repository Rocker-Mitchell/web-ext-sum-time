<script setup>
import { onMounted, ref, watch } from "vue";
import { isNull, isString } from "@/utils/type-checks";

// eslint-disable-next-line vue/require-prop-types
const model = defineModel();

const emit = defineEmits({
    /**
     * @param {ValidityState} state
     * @param {string} message
     */
    validity: (state, message) => {
        const validState = state instanceof ValidityState;
        if (!validState)
            console.warn("Invalid validity state for event: %o", state);
        const validMessage = isString(message);
        if (!validMessage)
            console.warn("Invalid validity message for event: %o", message);
        return validState && validMessage;
    },
});

/** @type {import("vue").Ref<HTMLInputElement | null>} */
const inputEl = ref(null);

function emitValidity() {
    const el = inputEl.value;
    if (!isNull(el)) {
        emit("validity", el.validity, el.validationMessage);
    }
}

// catch model updating the input, check after DOM changes
watch(model, () => emitValidity(), { flush: "post" });

onMounted(() => {
    // emit initial validity once mounted
    emitValidity();
});
</script>

<template>
    <input ref="inputEl" v-model="model" @input="emitValidity()" />
</template>
