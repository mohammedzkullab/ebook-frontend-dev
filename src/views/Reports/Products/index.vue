<script setup>
import { ref, onMounted, watch } from 'vue';
import HTTP from '@/apis/HTTP.js';

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Datatable from '@/components/Dashboard/Datatable.vue';
import TimeAdapter from '@/components/Converter.js'

const loading = ref(false);

const startDateMostBuyBook = ref('');
const endDateMostBuyBook = ref('');
const startDateUser = ref('');
const endDateUser = ref('');
const timeFilterMostBuyBook = ref('daily');


// Reports Data
const viewsReport = ref([]);
const bestSellersReport = ref([]);
const freeBooksReport = ref([]);
const previewCopiesReport = ref([]);
const customerRatingsReport = ref([]);

// Fetch Data
const fetchReports = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/products')
      .withToken()
      .withQuery({
        filter_most_buy_book: timeFilterMostBuyBook.value,
        start_date_most_buy_book: startDateMostBuyBook.value || null,
        end_date_most_buy_book: endDateMostBuyBook.value || null,
        start_date_user_library_books: startDateUser.value || null,
        end_date_user_library_books: endDateUser.value || null,
      })
      .get();
    const data = response.data.data;
    viewsReport.value = data.watch_books.data.map(item => ({
      name: item.name,
      view_count: item.view_count
    }));

    bestSellersReport.value = data.most_buy_book.data.map(item => ({
      latest_order_date: item.latest_order_date,
      book_name: item.book_name,
      total_sales: item.total_sales
    }));

    freeBooksReport.value = data.free_books.data.map(item => ({
      book_name: item.book_name,
      free_since: item.free_since,
      purchase_count: item.purchase_count
    }));

    previewCopiesReport.value = data.user_library_books.data.map(item => ({
      added_at: item.added_at,
      book_name: item.book_name,
      additions_count: item.additions_count
    }));

    customerRatingsReport.value = data.rates.data.map(item => ({
      name: item.name,
      review_count: item.review_count,
      average_rating: item.average_rating,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

watch([timeFilterMostBuyBook, startDateMostBuyBook, endDateMostBuyBook,
  startDateUser, endDateUser], fetchReports, { immediate: true });

// onMounted(() => {
//   fetchReports();
// });
</script>


<template>
  <DefaultLayout :loading="loading">
    <BreadcrumbDefault :pageTitle="'Products'" />
    <div class="flex flex-col gap-10">

      <!-- Views Report -->
      <div class="max-w-full overflow-x-auto mt-10">
        <div class="flex flex-col md:flex-row justify-between mb-2">
          <h2 class="text-lg font-semibold mb-4">Views Report</h2>
<!--          <input-->
<!--            type="date"-->
<!--            v-model="dateFilter"-->
<!--            class="border rounded px-3 py-2"-->
<!--            placeholder="Filter by Date"-->
<!--          />-->
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Book Name</th>
              <th class="py-3 px-3">View Count</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(view, index) in viewsReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index+1 }}</td>
              <td class="py-2 px-3">{{ view.name }}</td>
              <td class="py-2 px-3">{{ view.view_count }}</td>
            </tr>
          </template>
        </Datatable>
      </div>
      
      <!-- Best Sellers Report -->
      <div class="max-w-full mt-16">
        <h2 class="text-lg font-semibold mb-4">Best Sellers Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="startDateMostBuyBook"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="endDateMostBuyBook"
                class="border rounded px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>
          <select v-model="timeFilterMostBuyBook" class="border rounded px-3 py-2">
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3">Book Name</th>
              <th class="py-3 px-3">Total Sales</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(bestSeller, index) in bestSellersReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ bestSeller.date }}</td>
              <td class="py-2 px-3">{{ bestSeller.book_name }}</td>
              <td class="py-2 px-3">{{ bestSeller.total_sales }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Free Books Report -->
      <div class="max-w-full overflow-x-auto mt-16">
        <div class="flex flex-col md:flex-row justify-between mb-2">
          <h2 class="text-lg font-semibold mb-4">Free Books Report</h2>

<!--          <div class="flex gap-2"></div>-->
<!--          <input-->
<!--            type="date"-->
<!--            v-model="dateFilter"-->
<!--            class="border rounded px-3 py-2"-->
<!--            placeholder="Filter by Date"-->
<!--          />-->
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Book Name</th>
              <th class="py-3 px-3">Free Date</th>
              <th class="py-3 px-3">Purchases</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(freeBook, index) in freeBooksReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index+1 }}</td>
              <td class="py-2 px-3">{{ freeBook.book_name }}</td>
              <td class="py-2 px-3">{{ TimeAdapter.convert(freeBook.free_since ) }}</td>
              <td class="py-2 px-3">{{ freeBook.purchase_count }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Preview Copies Report -->
      <div class="max-w-full mt-16">
        <h2 class="text-lg font-semibold mb-4">Preview Copies Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="startDateUser"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="endDateUser"
                class="border rounded px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3">Book Name</th>
              <th class="py-3 px-3">Additions</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(preview, index) in previewCopiesReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index+1 }}</td>
              <td class="py-2 px-3">{{ preview.added_at }}</td>
              <td class="py-2 px-3">{{ preview.book_name }}</td>
              <td class="py-2 px-3">{{ preview.additions_count }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Customer Ratings Report -->
      <div class="max-w-full overflow-x-auto mt-16">
        <h2 class="text-lg font-semibold mb-4">Customer Ratings Report</h2>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Book Name</th>
              <th class="py-3 px-3">Reviewers</th>
              <th class="py-3 px-3">Rating Percentage</th>

            </tr>
          </template>
          <template #body>
            <tr v-for="(rating, index) in customerRatingsReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index+1 }}</td>
              <td class="py-2 px-3">{{ rating.name }}</td>
              <td class="py-2 px-3">{{ rating.review_count }}</td>
              <td class="py-2 px-3">{{ rating.average_rating }}</td>

            </tr>
          </template>
        </Datatable>
      </div>

    </div>
  </DefaultLayout>
</template>