<script setup>
import { computed } from "vue";
import TextCopyClipboardGroup from "@/components/TextCopyClipboardGroup.vue";
import { useOptionsStore } from "@/composables/options-store";
import { round } from "@/utils/round";

const { hoursSuffix, minutesSuffix, secondsSuffix, roundingDecimals } =
    useOptionsStore();

const props = defineProps({
    sumHours: {
        type: Number,
        required: true,
    },
    sumMinutes: {
        type: Number,
        required: true,
    },
    sumSeconds: {
        type: Number,
        required: true,
    },
    /** Flag that autofocus on mount should be done to the preferred result's copy button. */
    autofocus: Boolean,
});

const preferredUnit = computed(() => {
    if (props.sumHours >= 1) {
        return "hours";
    } else if (props.sumMinutes >= 1) {
        return "minutes";
    } else {
        return "seconds";
    }
});

const preferHours = computed(() => preferredUnit.value === "hours");
const preferMinutes = computed(() => preferredUnit.value === "minutes");
const preferSeconds = computed(() => preferredUnit.value === "seconds");

/**
 * Determine class modifiers from boolean state.
 * @param {booelan} isPreferred
 */
function preferredModifiers(isPreferred) {
    // primary when preferred, secondary otherwise
    return isPreferred ? undefined : "secondary";
}

/**
 * Helper to join suffix to string.
 * @param {string} str
 * @param {string} suffix
 */
function joinSuffix(str, suffix) {
    // remove space if suffix is effectively empty
    return `${str} ${suffix.trim()}`.trim();
}
</script>

<template>
    <article>
        <header v-if="$slots.header">
            <h3>
                <slot name="header"></slot>
            </h3>
        </header>

        <TextCopyClipboardGroup
            :value="
                joinSuffix(
                    round(sumHours, roundingDecimals).toString(),
                    hoursSuffix,
                )
            "
            :variant="preferredModifiers(preferHours)"
            :autofocus="autofocus && preferHours"
        />
        <TextCopyClipboardGroup
            :value="
                joinSuffix(
                    round(sumMinutes, roundingDecimals).toString(),
                    minutesSuffix,
                )
            "
            :variant="preferredModifiers(preferMinutes)"
            :autofocus="autofocus && preferMinutes"
        />
        <TextCopyClipboardGroup
            :value="
                joinSuffix(
                    round(sumSeconds, roundingDecimals).toString(),
                    secondsSuffix,
                )
            "
            :variant="preferredModifiers(preferSeconds)"
            :autofocus="autofocus && preferSeconds"
        />

        <p v-if="$slots.description">
            <slot name="description"></slot>
        </p>
    </article>
</template>

<style scoped lang="scss">
h3:last-child {
    margin-bottom: 0;
}

p:last-child {
    margin-bottom: 0;
}
</style>
