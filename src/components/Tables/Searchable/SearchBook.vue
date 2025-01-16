<script setup lang="ts">
import { ref, onMounted } from "vue";
import Multiselect from 'vue-multiselect';
import HTTP from '@/apis/HTTP.js';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

const categories = ref([]);
const searchName = ref("");
const searchAuthor = ref("");
const searchPublisher = ref("");
const searchIsbn = ref("");
const searchSku = ref("");
const priceFrom = ref(null);
const priceTo = ref(null);
const selectedCategory = ref(null);
const http = ref(HTTP);
const isLoading = ref(false);

const emit = defineEmits(["search"]);

const loadCategories = async (page = null) => {
  isLoading.value = true;
  try {
    const response = await http.value.action("categories").withToken().paginate(page);
    categories.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const searchCategory = async (search) => {
  http.value.search(search);
  await loadCategories();
};

const searchAction = () => {
  const searchPayload = {
    name: searchName.value,
    author: searchAuthor.value,
    publisher: searchPublisher.value,
    isbn: searchIsbn.value,
    sku: searchSku.value,
    category: selectedCategory.value,
    priceFrom: priceFrom.value,
    priceTo: priceTo.value,
  };
  emit('search', searchPayload);
};

const resetFilters = () => {
  searchName.value = "";
  searchAuthor.value = "";
  searchPublisher.value = "";
  searchIsbn.value = "";
  searchSku.value = "";
  priceFrom.value = null;
  priceTo.value = null;
  selectedCategory.value = null;
  searchAction();
};

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="flex flex-wrap w-full gap-4">
    <!-- Filters Wrapper -->
    <div class="flex flex-wrap w-full gap-4 sm:flex-row sm:justify-between">
      <div class="flex items-center w-full sm:w-1/5">
          <input
            type="text"
            v-model="searchName"
            placeholder="Book Name"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/5">
          <input
            type="text"
            v-model="searchAuthor"
            placeholder="Author Name"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/5">
          <input
            type="text"
            v-model="searchPublisher"
            placeholder="Publisher Name"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/6">
          <input
            type="text"
            v-model="searchIsbn"
            placeholder="ISBN"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
      <div class="flex items-center w-full sm:w-1/6">
          <input
            type="text"
            v-model="searchSku"
            placeholder="SKU"
            class="border p-3 w-full border-stroke rounded-lg  text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>
    </div>
    <div class="flex flex-wrap w-full gap-4 sm:flex-row sm:justify-between">
      <div class="flex items-center w-full sm:w-1/4">
          <input
            type="number"
            v-model="priceFrom"
            placeholder="Price From"
            class="border p-3 w-full border-stroke rounded-lg text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>

      <div class="flex items-center w-full sm:w-1/4">
          <input
            type="number"
            v-model="priceTo"
            placeholder="Price To"
            class="border p-3 w-full border-stroke rounded-lg  text-sm"
            @keydown.prevent.enter="searchAction"
          />
        </div>

      <div class="flex items-center w-full sm:w-1/4">
          <Multiselect
            v-model="selectedCategory"
            :options="categories"
            :searchable="true"
            placeholder="Select Category"
            label="name"
            track-by="id"
            @search-change="searchCategory"
            :options-limit="5"
            :loading="isLoading"
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


