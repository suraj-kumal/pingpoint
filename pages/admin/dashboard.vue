<template>
    <h1>dashboard</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>{{ data }}</div>

    <form @submit.prevent="handleLogout">
        <button type="submit">Logout</button>
    </form>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { fetch: refreshSession } = useUserSession();

const data = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await fetch("/api/admin/cafes");
        data.value = await response.json();
    } catch (err) {
        error.value = err;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});

const handleLogout = async () => {
    try {
        await $fetch("/api/adminlogout", {
            method: "POST",
        });

        // refresh reactive auth state
        await refreshSession();

        // redirect
        await navigateTo("/admin/login");
    } catch (err) {
        console.error(err);
    }
};
</script>
