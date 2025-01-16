<script setup>
import { onMounted, ref, watch } from 'vue';
import HTTP from '@/apis/HTTP.js';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Datatable from '@/components/Dashboard/Datatable.vue';
import '@fortawesome/fontawesome-free/css/all.css';

const loading = ref(false);

const basketReport = ref([]);
const searchKeywordsReport = ref([]);
const filter = ref('week');

const BasketReport = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/marketing').withToken().get();
    const data = response.data.data;
    basketReport.value = data.map((item) => ({
      book_name: item.book_name,
      price: item.price,
      cart_count: item.cart_count,
    }));
  } catch (error) {
    console.error('Error fetching basket report:', error);
  } finally {
    loading.value = false;
  }
};

const KeywordReport = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/search-history')
      .withToken()
      .withQuery({
        filter: filter.value,
      })
      .get();
    const data = response.data.data;
    searchKeywordsReport.value = data.data.map((item) => ({
      keyword: item.keyword,
      search_count: item.search_count,
      result_count: item.total_results,
    }));
  } catch (error) {
    console.error('Error fetching keyword report:', error);
  } finally {
    loading.value = false;
  }
};

watch([filter], KeywordReport, { immediate: true });

onMounted(() => {
  BasketReport();
  KeywordReport();
});
</script>

<template>
  <DefaultLayout :loading="loading">
    <BreadcrumbDefault :pageTitle="'Marketing'" />

    <!-- Basket Items Report -->
    <div class="pt-6 pb-6">
      <div class="flex flex-col md:flex-row justify-between mb-4">
        <h2 class="text-lg font-semibold">Basket Items Report</h2>
      </div>

      <div v-if="basketReport.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="(item, index) in basketReport.slice(0, 4)"
          :key="index"
          class=" rounded-lg p-4 bg-[#f9fbfc]"
        >
          <h3 class="font-semibold text-lg">{{ item.book_name }}</h3>
          <p class="flex items-center">
            <i class="fa-solid fa-tag mr-2 text-gray-600"></i> <span> Price: </span>
            {{ item.price }}

          </p>
          <p class="flex items-center">
            <i class="fa-solid fa-shopping-basket mr-2 text-gray-600"></i> <span> Baskets: </span>
            {{ item.cart_count }}
          </p>
        </div>
      </div>

      <div class="overflow-x-auto" v-if="basketReport.length > 4">
        <Datatable>
          <template #head>
            <tr class="uppercase bg-gray-100 dark:bg-gray-800">
              <th class="py-3 px-4 w-16">No</th>
              <th class="py-3 px-4">Name</th>
              <th class="py-3 px-4">Price</th>
              <th class="py-3 px-4">Baskets</th>
            </tr>
          </template>

          <template #body>
            <tr
              class="border-b dark:border-gray-700"
              v-for="(item, index) in basketReport.slice(4)"
              :key="index"
            >
              <td class="py-2 px-4">{{ index + 5 }}</td>
              <td class="py-2 px-4">{{ item.book_name }}</td>
              <td class="py-2 px-4">{{ item.price }}</td>
              <td class="py-2 px-4">{{ item.cart_count }}</td>
            </tr>
          </template>
        </Datatable>
      </div>
    </div>

    <!-- Search Keywords Report -->
    <div class="overflow-x-auto mt-16">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Search Keywords Report</h2>
        <select
          v-model="filter"
          class="border rounded px-3 py-2"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="6-months">6 Months</option>
          <option value="year">Year</option>
        </select>
      </div>

      <Datatable>
        <template #head>
          <tr class="uppercase bg-gray-100 dark:bg-gray-800">
            <th class="py-3 px-4 w-16">No</th>
            <th class="py-3 px-4">Search Keyword</th>
            <th class="py-3 px-4">Search Count</th>
            <th class="py-3 px-4">Search Results Count</th>
          </tr>
        </template>

        <template #body>
          <tr
            class="border-b dark:border-gray-700"
            v-for="(item, index) in searchKeywordsReport"
            :key="index"
          >
            <td class="py-2 px-4">{{ index + 1 }}</td>
            <td class="py-2 px-4">{{ item.keyword }}</td>
            <td class="py-2 px-4">{{ item.search_count }}</td>
            <td class="py-2 px-4">{{ item.result_count }}</td>
          </tr>
        </template>
      </Datatable>
    </div>
  </DefaultLayout>
</template>


