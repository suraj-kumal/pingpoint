<template>
    <div>
        <h1>Add New Cafe</h1>

        <form @submit.prevent="handleSubmit">
            <div>
                <label>Name *</label>
                <input
                    v-model="form.name"
                    @input="autoSlug"
                    type="text"
                    placeholder="Himalayan Brews"
                />
                <p v-if="errors.name">{{ errors.name }}</p>
            </div>

            <div>
                <label>Slug *</label>
                <input
                    v-model="form.slug"
                    type="text"
                    placeholder="himalayan-brews"
                />
                <p v-if="errors.slug">{{ errors.slug }}</p>
            </div>

            <div>
                <label>City</label>
                <input
                    v-model="form.city"
                    type="text"
                    placeholder="Kathmandu"
                />
            </div>

            <div>
                <label>Location / Area</label>
                <input
                    v-model="form.location"
                    type="text"
                    placeholder="Thamel"
                />
            </div>

            <div>
                <label>Cover Image URL</label>
                <input
                    v-model="form.coverImage"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                />
            </div>

            <div>
                <label>Excerpt</label>
                <textarea v-model="form.excerpt" rows="2" />
            </div>

            <div>
                <label>Description</label>
                <RichEditor v-model="form.description" />
            </div>

            <div>
                <label>Conclusion</label>
                <textarea v-model="form.conclusion" rows="3" />
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
                <input
                    v-model="form.metaKeywords"
                    type="text"
                    placeholder="cafe, kathmandu, coffee"
                />
            </div>

            <div>
                <label>
                    <input v-model="form.isPublished" type="checkbox" />
                    Published
                </label>
            </div>

            <p v-if="errors.general">{{ errors.general }}</p>

            <button type="submit" :disabled="loading">
                {{ loading ? "Creating..." : "Create Cafe" }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();

const loading = ref(false);

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

const autoSlug = () => {
    form.slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};

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
        await $fetch("/api/admin/cafes", {
            method: "POST",
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
