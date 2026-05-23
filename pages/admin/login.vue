<template>
    <div class="login-container">
        <h1>Login</h1>

        <p v-if="errorMessage" class="error">
            {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="success">
            {{ successMessage }}
        </p>

        <form @submit.prevent="handleLogin">
            <input type="email" v-model="email" placeholder="Email" required />

            <input
                type="password"
                v-model="password"
                placeholder="Password"
                required
            />

            <button type="submit" :disabled="loading">
                {{ loading ? "Logging in..." : "Login" }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const { fetch: refreshSession } = useUserSession();
const loading = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

const email = ref("");
const password = ref("");

const router = useRouter();

const handleLogin = async () => {
    loading.value = true;

    errorMessage.value = "";
    successMessage.value = "";

    try {
        await $fetch("/api/adminlogin", {
            method: "POST",
            body: {
                email: email.value,
                password: password.value,
            },
        });

        // IMPORTANT
        await refreshSession();

        successMessage.value = "Login successful";

        await navigateTo("/admin/dashboard");
    } catch (error) {
        console.log(error);

        errorMessage.value = error?.data?.message || "Invalid credentials";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.error {
    color: red;
}

.success {
    color: green;
}
</style>
