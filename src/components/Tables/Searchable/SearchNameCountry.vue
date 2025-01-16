<script setup lang="ts">
import { ref, onMounted } from "vue";
import Multiselect from 'vue-multiselect';
import HTTP from '@/apis/HTTP.js';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

const countries = ref([]);
const searchName = ref("");
const selectedCountry = ref(null);
const http = ref(HTTP);
const isLoading = ref(false);

const props = defineProps({
  placeholderCountry: {
    type: String,
    required: true,
  },
  placeholderName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["search"]);

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
  };
  emit('search', searchPayload);
};

const resetFilters = () => {
  searchName.value = "";
  selectedCountry.value = null;
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
      <div class="flex items-center w-full sm:w-1/3">
          <input
            type="text"
            v-model="searchName"
            :placeholder="placeholderName"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/3">
          <Multiselect
            v-model="selectedCountry"
            :options="countries"
            :searchable="true"
            :placeholder="placeholderCountry"
            label="name"
            track-by="id"
            @search-change="searchCountry"
            :options-limit="5"
            :loading="isLoading"
          />
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
