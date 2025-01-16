<script setup>
import { ref, watch } from 'vue'
import HTTP from '@/apis/HTTP.js';

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Datatable from '@/components/Dashboard/Datatable.vue';

const loading = ref(false);

// Filters
const startDateOrder = ref('');
const endDateOrder = ref('');
const startDateUser = ref('');
const endDateUser = ref('');
const timeFilterOrder = ref('daily');
const timeFilterUser = ref('daily');

// Reports Data
const newAndLeavingCustomersReport = ref([]);
const topBuyersReport = ref([]);

const fetchCustomerReport = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/customers')
      .withToken()
      .withQuery({
        filter_order: timeFilterOrder.value,
        filter_user: timeFilterUser.value,
        start_date_order: startDateOrder.value || null,
        end_date_order: endDateOrder.value || null,
        start_date_user: startDateUser.value || null,
        end_date_user: endDateUser.value || null,
      })
      .get();
    const data = response.data;

    newAndLeavingCustomersReport.value = [
      {
        date: data.date,
        new_clients: data.new_clients,
        leaving_clients: data.leaving_clients,
      },
    ];

    topBuyersReport.value = data.orders.data.map((order) => ({
      date: order.date,
      client_name: order.client_name,
      book_counts: order.number_of_books,
      purchase_counts: order.total_purchase,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

watch([timeFilterOrder, startDateOrder, endDateOrder,
  timeFilterUser, startDateUser, endDateUser], fetchCustomerReport, { immediate: true });

</script>

<template>
  <DefaultLayout :loading="loading">
    <BreadcrumbDefault :pageTitle="'Customer Reports'" />
    <div class="flex flex-col gap-10">
      <!-- New and Leaving Customers Report -->
      <div class="max-w-full mt-10">
        <h2 class="text-lg font-semibold mb-4">New and Leaving Customers Report</h2>
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
          <select v-model="timeFilterUser" class="border rounded px-3 py-2">
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
              <th class="py-3 px-3">New Customers</th>
              <th class="py-3 px-3">Leaving Customers</th>
            </tr>
          </template>
          <template #body>
            <tr
              v-for="(entry, index) in newAndLeavingCustomersReport"
              :key="index"
              class="border-b"
            >
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ entry.date }}</td>
              <td class="py-2 px-3">{{ entry.new_clients }}</td>
              <td class="py-2 px-3">{{ entry.leaving_clients }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Top Buyers Report -->
      <div class="max-w-full overflow-x-auto mt-18">
        <h2 class="text-lg font-semibold mb-4">Top Buyers Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="startDateOrder"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="endDateOrder"
                class="border rounded px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>
          <select v-model="timeFilterOrder" class="border rounded px-3 py-2">
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
              <th class="py-3 px-3">Customer Name</th>
              <th class="py-3 px-3">Books Count</th>
              <th class="py-3 px-3">Total Purchase</th>
            </tr>
          </template>
          <template #body>
            <tr
              v-for="(entry, index) in topBuyersReport"
              :key="index"
              class="border-b"
            >
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ entry.date }}</td>
              <td class="py-2 px-3">{{ entry.client_name }}</td>
              <td class="py-2 px-3">{{ entry.book_counts }}</td>
              <td class="py-2 px-3">{{ entry.purchase_counts }}</td>
            </tr>
          </template>
        </Datatable>
      </div>
    </div>
  </DefaultLayout>
</template>