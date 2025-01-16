<script setup>
defineProps({
    type: {
        type: String,
    },
    xClass: {
      type: String,
      default: 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-neutral-800'
    }
});
</script>

<template>
    <button :type="type" class="dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white dark:hover:border-white dark:focus:bg-white dark:active:bg-gray-300 dark:focus:ring-offset-gray-800 bg-black hover:bg-white hover:text-black hover:border-black inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition ease-in-out duration-150" :class="xClass">
        <slot />
    </button>
</template>
