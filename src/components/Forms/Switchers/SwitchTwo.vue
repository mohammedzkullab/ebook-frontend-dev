<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
});

const switcherToggle = ref<number>(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    switcherToggle.value = newValue;
  },
  { immediate: true }
);

function toggleSwitch() {
  const newValue = switcherToggle.value === 0 ? 1 : 0;
  switcherToggle.value = newValue;
  emit('update:modelValue', newValue);
}

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label :for="id" class="flex cursor-pointer select-none items-center">
      <div class="relative my-2">
        <input
          :id="id"
          type="checkbox"
          class="sr-only"
          :checked="switcherToggle === 1"
          @change="toggleSwitch"
        />
        <div class="h-5 w-14 rounded-full bg-meta-9 shadow-inner dark:bg-[#5A616B]"></div>
        <div
          :class="switcherToggle === 1 && '!right-0 !translate-x-full !bg-primary dark:!bg-white'"
          class="dot absolute left-0 -top-1 h-7 w-7 rounded-full bg-white shadow-switch-1 transition"
        ></div>
      </div>
    </label>
  </div>
</template>
