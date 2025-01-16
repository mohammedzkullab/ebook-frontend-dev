<script setup lang="ts">
import { ref, onMounted } from "vue";
import Multiselect from 'vue-multiselect';
import HTTP from '@/apis/HTTP.js';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

const packages = ref([]);
const searchName = ref("");
const searchBook = ref("");
const selectedPackage = ref(null);
const http = ref(HTTP);
const isLoading = ref(false);

const emit = defineEmits(["search"]);

const loadPackages = async (page = null) => {
  isLoading.value = true;
  try {
    const response = await http.value.action('packages').withToken().paginate(page);
    packages.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const searchPackage = async (search) => {
  http.value.search(search);
  await loadPackages();
};

const searchAction = () => {
  const searchPayload = {
    name: searchName.value,
    book: searchBook.value,
    package: selectedPackage.value,
  };
  emit('search', searchPayload);
};

const resetFilters = () => {
  searchName.value = "";
  searchBook.value = "";
  selectedPackage.value = null;
  searchAction();
};

onMounted(() => {
  loadPackages();
});
</script>

<template>
  <div class="flex flex-wrap w-full gap-4">
    <!-- Filters Wrapper -->
    <div class="flex flex-wrap w-full gap-4 sm:flex-row sm:justify-between">
      <div class="flex items-center w-full sm:w-1/4">
          <input
            type="text"
            v-model="searchName"
            placeholder="Offer Name"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/4">
          <input
            type="text"
            v-model="searchBook"
            placeholder="Book Name"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/4">
          <Multiselect
            v-model="selectedPackage"
            :options="packages"
            :searchable="true"
            placeholder="Select a package"
            label="name"
            track-by="id"
            @search-change="searchPackage"
            :options-limit="5"
            :loading="isLoading"
            class="w-full"
          />
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
