<script setup lang="ts">
import { ref } from "vue";
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

const searchName = ref("");
const selectedRole = ref(null);

const roles = ref([
  { id: 'SUPER_ADMIN', label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
  { id: 'ADMIN', label: 'ADMIN', value: 'ADMIN' },
  { id: 'All', label: 'All', value: null }
]);

const emit = defineEmits(["search"]);

const searchAction = () => {
  const searchPayload = {
    name: searchName.value,
    role: selectedRole.value,
  };
  emit('search', searchPayload);
};

const resetFilters = () => {
  searchName.value = "";
  selectedRole.value = null;
  searchAction();
};
</script>

<template>
  <div class="flex flex-wrap w-full gap-4">
    <!-- Filters Wrapper -->
    <div class="flex flex-wrap w-full gap-4 sm:flex-row sm:justify-between">
      <div class="flex items-center w-full sm:w-1/3">
          <input
            type="text"
            v-model="searchName"
            placeholder="Name"
            class="border p-3 w-full border-stroke rounded-lg  text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/3">
          <select v-model="selectedRole" class="border p-3 w-full border-stroke rounded-lg text-sm">
            <option v-for="role in roles" :key="role.id" :value="role.value">{{ role.label }}</option>
          </select>
        </div>
      <div class="flex items-center gap-2 w-full sm:w-1/4">
          <PrimaryButton x-class="my-1 py-3 text-white w-full text-center flex justify-center" @click="searchAction">Search</PrimaryButton>
          <button
            class="my-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-400 rounded-lg shadow-sm transition-colors duration-200 w-full"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
</template>
