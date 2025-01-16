<script setup lang="ts">
import { ref, onMounted } from "vue";
import Multiselect from 'vue-multiselect';
import HTTP from '@/apis/HTTP.js';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

const countries = ref([]);
const searchName = ref("");
const selectedCountry = ref(null);
const selectedStatus = ref(null);
const http = ref(HTTP);
const isLoading = ref(false);

const emit = defineEmits(["search"]);

const typeStatus = [
  { id: 1, label: "All", value: null },
  { id: 2, label: "Active", value: 1 },
  { id: 3, label: "Inactive", value: 0 },
];


const loadCountries = async (page = null) => {
  isLoading.value = true;
  try {
    const response = await http.value.action("countries").withToken().paginate(page);
    countries.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const searchCountry = async (search) => {
  http.value.search(search);
  await loadCountries();
};

const searchAction = () => {
  const searchPayload = {
    name: searchName.value,
    country: selectedCountry.value,
    status: selectedStatus.value,
  };
  emit("search", searchPayload);
};

const resetFilters = () => {
  searchName.value = "";
  selectedCountry.value = null;
  selectedStatus.value = null;
  searchAction();
};

onMounted(() => {
  loadCountries();
});
</script>

<template>
  <div class="flex flex-wrap w-full gap-4">
    <!-- Filters Wrapper -->
    <div class="flex flex-wrap w-full gap-4 sm:flex-row sm:justify-between">
      <!-- Name Input -->
      <div class="flex items-center w-full sm:w-1/4">
        <input
          type="text"
          v-model="searchName"
          placeholder="User Name"
          class="border p-2 py-2.5 w-full border-stroke rounded-lg "
          @keydown.prevent.enter="searchAction"
        />
      </div>
      <!-- Country Select -->
      <div class="flex items-center w-full sm:w-1/4" >
        <Multiselect
          v-model="selectedCountry"
          :options="countries"
          :searchable="true"
          placeholder="Select Country"
          label="name"
          track-by="id"
          @search-change="searchCountry"
          :options-limit="5"
          :loading="isLoading"
        />
      </div>
      <!-- Status Dropdown -->
      <div class="flex items-center w-full sm:w-1/4">
        <select
          v-model="selectedStatus"
          placeholder="Select status"
          class="border p-2 py-2.5 border-stroke rounded-lg w-full"
        >
          <option
            v-for="option in typeStatus"
            :key="option.id"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <!-- Buttons -->
      <div class="flex items-center gap-2 w-full sm:w-1/5">
        <PrimaryButton
          x-class="my-1 py-3 text-white w-full text-center flex justify-center"
          @click="searchAction"
        >
          Search
        </PrimaryButton>
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

