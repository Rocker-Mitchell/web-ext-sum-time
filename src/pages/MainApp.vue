<script setup>
import { ref } from "vue";
import AppNavbar from "@/components/AppNavbar.vue";
import ToastList from "@/components/ToastList.vue";
import SumResults from "@/views/SumResults.vue";
import TimesForm from "@/views/TimesForm.vue";

const showResults = ref(false);
</script>

<template>
    <header>
        <AppNavbar />
    </header>
    <main>
        <TimesForm v-if="!showResults" @submit="showResults = true" />
        <SumResults v-else @close="showResults = false" />
    </main>
    <ToastList />
</template>
