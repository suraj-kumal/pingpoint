<template>
    <h1>dashboard</h1>

    <form @submit.prevent="handleLogout">
        <button type="submit">Logout</button>
    </form>
</template>

<script setup>
const handleLogout = async () => {
    try {
        const { data, error } = await useFetch("/api/adminlogout", {
            method: "POST",
        });

        if (data.value?.success) {
            await navigateTo("/admin/login");
        }

        if (error.value) {
            console.error(error.value);
        }
    } catch (err) {
        console.error(err);
    }
};
</script>
