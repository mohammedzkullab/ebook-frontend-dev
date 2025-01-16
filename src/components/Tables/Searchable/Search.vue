<script setup lang="ts">
import { ref, watch } from 'vue';

const search = ref('');
let timeout: ReturnType<typeof setTimeout>;

const props = defineProps({
  placeholder: {
    type: String,
    required: true
  }
});

const emit = defineEmits([
  'search'
]);

const searchAction = () => {
  emit('search', search.value);
};

// Watch for changes in the search input
watch(search, () => {
  // Clear any existing timeout
  clearTimeout(timeout);

  // Set a new timeout to wait 500ms after the user stops typing
  timeout = setTimeout(() => {
    searchAction();
  }, 500); // 500ms delay before triggering the search
});
</script>

<template>
  <div class="flex gap-2 min-w-[25%]">
    <input
      type="text"
      v-model="search"
      :placeholder="placeholder"
      class="border p-2  min-w-full py-1.5 border-stroke rounded-lg lowercase"
    />
  </div>
</template>