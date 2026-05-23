<template>
    <div>
        <div v-if="editor">
            <!-- Font Family -->
            <select
                @change="
                    editor
                        .chain()
                        .focus()
                        .setFontFamily($event.target.value)
                        .run()
                "
            >
                <option value="">Default</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">
                    Times New Roman
                </option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Helvetica Neue', sans-serif">
                    Helvetica Neue
                </option>
            </select>

            <!-- Text Style -->
            <button
                type="button"
                @click="editor.chain().focus().toggleBold().run()"
            >
                Bold
            </button>
            <button
                type="button"
                @click="editor.chain().focus().toggleItalic().run()"
            >
                Italic
            </button>
            <button
                type="button"
                @click="editor.chain().focus().toggleStrike().run()"
            >
                Strike
            </button>

            <!-- Headings -->
            <button
                type="button"
                @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
            >
                H1
            </button>
            <button
                type="button"
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
            >
                H2
            </button>
            <button
                type="button"
                @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
            >
                H3
            </button>

            <!-- Lists -->
            <button
                type="button"
                @click="editor.chain().focus().toggleBulletList().run()"
            >
                • Bullet
            </button>
            <button
                type="button"
                @click="editor.chain().focus().toggleOrderedList().run()"
            >
                1. Ordered
            </button>

            <!-- Alignment -->
            <button
                type="button"
                @click="editor.chain().focus().setTextAlign('left').run()"
            >
                Left
            </button>
            <button
                type="button"
                @click="editor.chain().focus().setTextAlign('center').run()"
            >
                Center
            </button>
            <button
                type="button"
                @click="editor.chain().focus().setTextAlign('right').run()"
            >
                Right
            </button>
            <button
                type="button"
                @click="editor.chain().focus().setTextAlign('justify').run()"
            >
                Justify
            </button>

            <!-- Image -->
            <button type="button" @click="insertImage">Image URL</button>

            <!-- Misc -->
            <button
                type="button"
                @click="editor.chain().focus().toggleBlockquote().run()"
            >
                Quote
            </button>
            <button
                type="button"
                @click="editor.chain().focus().setHorizontalRule().run()"
            >
                HR
            </button>
            <button type="button" @click="editor.chain().focus().undo().run()">
                Undo
            </button>
            <button type="button" @click="editor.chain().focus().redo().run()">
                Redo
            </button>
        </div>

        <EditorContent :editor="editor" />
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        TextStyle,
        FontFamily,
        Image.configure({
            inline: false,
            allowBase64: false, // URL only, no base64
        }),
        TextAlign.configure({
            types: ["heading", "paragraph", "image"],
        }),
    ],
    onUpdate: ({ editor }) => {
        emit("update:modelValue", editor.getHTML());
    },
});

const insertImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run();
    }
};

watch(
    () => props.modelValue,
    (val) => {
        if (editor.value && editor.value.getHTML() !== val) {
            editor.value.commands.setContent(val, false);
        }
    },
);

onBeforeUnmount(() => editor.value?.destroy());
</script>
