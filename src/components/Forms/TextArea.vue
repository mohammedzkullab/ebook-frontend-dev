<script setup>

import {ref} from "vue";

defineProps({
    modelValue: String,
});

defineEmits(['update:modelValue']);

const input = ref(null);

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <textarea
        ref="input"
        class="border py-1 px-2 text-sm border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
</template>
