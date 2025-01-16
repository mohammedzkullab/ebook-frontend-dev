<!--<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
    <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 transform transition-transform duration-300 scale-95 hover:scale-100">
      <div class="flex justify-center mb-4">
        <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1H6a1 1 0 000 2h1v10a1 1 0 002 0V4h2v12a1 1 0 002 0V4h1a1 1 0 000-2h-4V3a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold mb-4 text-center text-gray-800">{{ message }}</h2>
      <div class="flex justify-between mt-4">
        <button
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Yes, Delete
        </button>
        <button
          @click="cancelDelete"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const confirmDelete = () => {
  emit('confirm');
};

const cancelDelete = () => {
  emit('cancel');
};
</script> -->
<script></script>
<template></template>