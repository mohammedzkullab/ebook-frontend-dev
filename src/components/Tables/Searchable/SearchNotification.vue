<script setup lang="ts">
import { ref } from "vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";

const searchTitle = ref("");
const selectedSendDate = ref(null);
const selectedType = ref(null);

const emit = defineEmits(["search"]);

const typeOptions = [
  { id: 1, label: "Important", value: "Important" },
  { id: 2, label: "Normal", value: "Normal" },
  { id: 3, label: "All", value: null },
];

const searchAction = () => {
  const searchPayload = {
    title: searchTitle.value,
    send_date: selectedSendDate.value,
    type: selectedType.value,
  };
  emit("search", searchPayload);
};

const resetFilters = () => {
  searchTitle.value = "";
  selectedSendDate.value = null;
  selectedType.value = null;
  searchAction();
};
</script>

<template>
  <div class="flex flex-wrap w-full gap-4">
    <!-- Filters Wrapper -->
    <div class="flex flex-wrap w-full gap-4 sm:flex-row sm:justify-between">
      <div class="flex items-center w-full sm:w-1/4">
          <input
            type="text"
            v-model="searchTitle"
            placeholder="Notification Title"
            class="border p-3 w-full border-stroke rounded-lg  text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/4">
          <input
            type="date"
            v-model="selectedSendDate"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/4">
          <select
            v-model="selectedType"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
          >
            <option
              v-for="option in typeOptions"
              :key="option.id"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      <div class="flex items-center gap-2 w-full sm:w-1/5">
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

