<script setup>
import { computed } from "vue";
import ResultCard from "@/components/ResultCard.vue";
import { useInputsStore } from "@/composables/inputs-store";

defineEmits(["close"]);

const { hours, minutes, seconds, divide } = useInputsStore();

const showDivide = computed(() => divide.value > 1);

const sumDescription = computed(() => {
    const times = [];
    if (hours.value > 0) {
        times.push(`${hours.value} hours`);
    }
    if (minutes.value > 0) {
        times.push(`${minutes.value} minutes`);
    }
    if (seconds.value > 0) {
        times.push(`${seconds.value} seconds`);
    }

    if (times.length === 0) {
        // if all units are 0, fallback to "0 seconds"
        return "0 seconds";
    }

    return times.join(", ");
});

const sumHours = computed(
    () => hours.value + minutes.value / 60 + seconds.value / 3600,
);
const sumMinutes = computed(
    () => hours.value * 60 + minutes.value + seconds.value / 60,
);
const sumSeconds = computed(
    () => hours.value * 3600 + minutes.value * 60 + seconds.value,
);

const dividedSumHours = computed(() => sumHours.value / divide.value);
const dividedSumMinutes = computed(() => sumMinutes.value / divide.value);
const dividedSumSeconds = computed(() => sumSeconds.value / divide.value);
</script>

<template>
    <p>
        <button class="outline secondary" @click="$emit('close')">
            Go Back
        </button>
    </p>

    <ResultCard
        v-if="showDivide"
        :sum-hours="dividedSumHours"
        :sum-minutes="dividedSumMinutes"
        :sum-seconds="dividedSumSeconds"
        :autofocus="showDivide"
    >
        <template #header> Divided Sum Times </template>
        <template #description> Divided by {{ divide }}. </template>
    </ResultCard>

    <ResultCard
        :sum-hours="sumHours"
        :sum-minutes="sumMinutes"
        :sum-seconds="sumSeconds"
        :autofocus="!showDivide"
    >
        <template #header> Sum Times </template>
        <template #description> Sum of {{ sumDescription }}. </template>
    </ResultCard>
</template>
