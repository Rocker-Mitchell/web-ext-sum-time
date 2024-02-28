<script setup>
import { useToastsStore } from "@/composables/toasts-store";

const { toasts } = useToastsStore();
</script>

<template>
    <TransitionGroup name="toast" tag="div" class="container toast-list">
        <div v-for="toast in toasts" :key="toast.id">
            <div role="alert" :class="toast.variant">
                {{ toast.message }}
            </div>
        </div>
    </TransitionGroup>
</template>

<style scoped lang="scss">
@use "@/styles/config" as *;

.toast-list {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity var(#{$css-var-prefix}transition, 0.2s ease-in-out);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
}
</style>
