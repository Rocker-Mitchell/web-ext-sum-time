<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
    /** Associate label to a DOM ID; should match ID on slotted element. */
    labelFor: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: undefined,
    },
    /** Assign a DOM ID to helper text; should match `aria-describedby` on slotted element. */
    helperId: {
        type: String,
        required: true,
    },
    /** Helper text for the field. */
    helper: {
        type: String,
        default: undefined,
    },
});
const slots = useSlots();

const hasLabel = computed(() => !!(props.label || slots.label));
const hasHelper = computed(() => !!(props.helper || slots.helper));
</script>

<template>
    <label v-if="hasLabel" :for="labelFor">
        <slot v-if="$slots.label" name="label" />
        <template v-else>{{ label }}</template>
    </label>

    <slot />

    <small v-show="hasHelper" :id="helperId">
        <slot v-if="$slots.helper" name="helper" />
        <template v-else>{{ helper }}</template>
    </small>
</template>
