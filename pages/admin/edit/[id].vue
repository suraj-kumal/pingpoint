<template>
    <div>
        <div v-if="fetchError">
            <p>Failed to load cafe.</p>
            <NuxtLink to="/admin/dashboard">Back to dashboard</NuxtLink>
        </div>

        <div v-else-if="pending">
            <p>Loading...</p>
        </div>

        <div v-else>
            <h1>Edit — {{ form.name }}</h1>

            <form @submit.prevent="handleSubmit">
                <div>
                    <label>Name *</label>
                    <input v-model="form.name" type="text" />
                    <p v-if="errors.name">{{ errors.name }}</p>
                </div>

                <div>
                    <label>Slug *</label>
                    <input v-model="form.slug" type="text" />
                    <p v-if="errors.slug">{{ errors.slug }}</p>
                </div>

                <div>
                    <label>City</label>
                    <input v-model="form.city" type="text" />
                </div>

                <div>
                    <label>Location / Area</label>
                    <input v-model="form.location" type="text" />
                </div>

                <div>
                    <label>Cover Image URL</label>
                    <input v-model="form.coverImage" type="url" />
                </div>

                <div>
                    <label>Excerpt</label>
                    <textarea v-model="form.excerpt" rows="2" />
                </div>

                <div>
                    <label>Description</label>
                    <RichEditor v-if="!pending" v-model="form.description" />
                </div>

                <div>
                    <label>Conclusion</label>
                    <RichEditor v-if="!pending" v-model="form.conclusion" />
                </div>

                <div>
                    <label>Meta Title</label>
                    <input v-model="form.metaTitle" type="text" />
                </div>

                <div>
                    <label>Meta Description</label>
                    <textarea v-model="form.metaDescription" rows="2" />
                </div>

                <div>
                    <label>Meta Keywords</label>
                    <input v-model="form.metaKeywords" type="text" />
                </div>

                <div>
                    <label>
                        <input v-model="form.isPublished" type="checkbox" />
                        Published
                    </label>
                </div>

                <p v-if="errors.general">{{ errors.general }}</p>

                <NuxtLink to="/admin/dashboard">Cancel</NuxtLink>
                <button type="submit" :disabled="loading">
                    {{ loading ? "Saving..." : "Save Changes" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    ssr: false,
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const loading = ref(false);
const fetchError = ref(false);
const pending = ref(true);

const form = reactive({
    name: "",
    slug: "",
    city: "",
    location: "",
    coverImage: "",
    excerpt: "",
    description: "",
    conclusion: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    isPublished: true,
});

const errors = reactive({
    name: "",
    slug: "",
    general: "",
});

onMounted(async () => {
    try {
        const res = await $fetch<{ data: any }>(`/api/admin/cafes/${id}`);
        const cafe = res?.data;
        if (!cafe) return;

        form.name = cafe.name ?? "";
        form.slug = cafe.slug ?? "";
        form.city = cafe.city ?? "";
        form.location = cafe.location ?? "";
        form.coverImage = cafe.coverImage ?? "";
        form.excerpt = cafe.excerpt ?? "";
        form.description = cafe.description ?? "";
        form.conclusion = cafe.conclusion ?? "";
        form.metaTitle = cafe.metaTitle ?? "";
        form.metaDescription = cafe.metaDescription ?? "";
        form.metaKeywords = cafe.metaKeywords ?? "";
        form.isPublished = cafe.isPublished ?? true;
    } catch {
        fetchError.value = true;
    } finally {
        pending.value = false;
    }
});

const validate = () => {
    errors.name = "";
    errors.slug = "";
    let valid = true;
    if (!form.name.trim()) {
        errors.name = "Name is required";
        valid = false;
    }
    if (!form.slug.trim()) {
        errors.slug = "Slug is required";
        valid = false;
    }
    return valid;
};

const handleSubmit = async () => {
    if (!validate()) return;
    loading.value = true;
    errors.general = "";

    try {
        await $fetch(`/api/admin/cafes/${id}`, {
            method: "PUT",
            body: {
                name: form.name.trim(),
                slug: form.slug.trim(),
                city: form.city || null,
                location: form.location || null,
                coverImage: form.coverImage || null,
                excerpt: form.excerpt || null,
                description: form.description || null,
                conclusion: form.conclusion || null,
                metaTitle: form.metaTitle || null,
                metaDescription: form.metaDescription || null,
                metaKeywords: form.metaKeywords || null,
                isPublished: form.isPublished,
            },
        });
        await router.push("/admin/dashboard");
    } catch (err: any) {
        if (err?.data?.statusMessage === "Slug already exists") {
            errors.slug = "This slug is already taken";
        } else {
            errors.general = "Something went wrong. Please try again.";
        }
    } finally {
        loading.value = false;
    }
};
</script>
