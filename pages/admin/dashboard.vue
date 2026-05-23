<template>
    <h1>dashboard</h1>

    <form @submit.prevent="handleLogout">
        <button type="submit">Logout</button>
    </form>
</template>

<script setup>
const { fetch: refreshSession } = useUserSession();

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
