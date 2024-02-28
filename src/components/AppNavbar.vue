<script setup>
defineProps({
    hideOptions: Boolean,
});

function openOptions() {
    chrome.runtime.openOptionsPage();
}
</script>

<template>
    <nav>
        <ul>
            <li>
                <h1 class="brand">
                    <img
                        class="brand__logo"
                        src="@/assets/logo.svg"
                        alt="Sum Time logo"
                        width="48"
                        height="48"
                    />
                    <span>Sum Time</span>
                </h1>
            </li>
        </ul>
        <ul v-if="!hideOptions">
            <li>
                <a class="contrast" @click="openOptions">Options</a>
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
h1.brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0;

    .brand__logo {
        width: 2.4rem;
    }
}
</style>
