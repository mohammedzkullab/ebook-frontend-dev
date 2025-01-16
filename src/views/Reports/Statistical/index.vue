<script setup>
import { ref, onMounted, watch } from 'vue';
import HTTP from '@/apis/HTTP.js';

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Datatable from '@/components/Dashboard/Datatable.vue';

// Loading state
const loading = ref(false);

// Filters
const startDateFilterDownload = ref('');
const endDateFilterDownload = ref('');
const timeFilterDownload = ref('daily');

const dateFilter= ref('');
const timeFilter = ref('daily');

// Reports Data
const downloadsReport = ref([]);
const readingBehaviorReport = ref([]);
const devicesReport = ref([]);


//device
const startDataFilterDevice= ref('');
const endDataFilterDevice= ref('');


const DeviceReports = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/device-report').withToken().get({
      params: {
        start_date: startDataFilterDevice.value || null,
        end_date: endDataFilterDevice.value || null,
      },
    });
    const data = response.data.data;
    devicesReport.value = data.map((item) => ({
      installation_date: item.installation_date,
      device_type: item.device_type,
      os_type: item.os_type,
      book_count:item.book_count
    }));
  } catch (error) {
    console.error('Error fetching report:', error);
  } finally {
    loading.value = false;
  }
};

const DownloadReports = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/download-report').withToken().get({
      params: {
        start_date: startDateFilterDownload.value || null,
        end_date: endDateFilterDownload.value || null,
        period: timeFilter.value,
      },
    });

    const data = response.data.data;

    downloadsReport.value = data.daily_data.map((item) => ({
      date: item.date,
      download_size: item.download_size,
      details: item.details,
    }));
  } catch (error) {
    console.error('Error fetching report:', error);
  } finally {
    loading.value = false;
  }
};

const ReadingReports = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/reading-behavior-report').withToken().get({
      params: {
        start_date: dateFilter.value || null,
        end_date: dateFilter.value || null ,
        period: timeFilter.value,
      },
    });

    const data = response.data.data;

    readingBehaviorReport.value = data.daily_data.map((item) => ({
      date: item.date,
      user_name: item.user_name,
      total_reading_hours: item.total_reading_hours,
      total_readers: item.total_readers,
      total_pages: item.total_pages,
      total_books: item.total_books,
      completed_books: item.completed_books
    }));
  } catch (error) {
    console.error('Error fetching report:', error);
  } finally {
    loading.value = false;
  }
};


watch([startDataFilterDevice, endDataFilterDevice,], DeviceReports, { immediate: true });
watch([startDateFilterDownload, endDateFilterDownload, timeFilterDownload], DownloadReports, { immediate: true });
// watch([startDateReading, endDateReading, timeFilterReading], ReadingReports, { immediate: true });

onMounted(() => {
  DeviceReports();
  DownloadReports();
  ReadingReports();
});
</script>

<template>
  <DefaultLayout :loading="loading">
    <BreadcrumbDefault :pageTitle="'Statistical Reports'" />
    <div class="flex flex-col gap-10">

      <!-- Downloads Report -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Downloads Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="startDateFilterDownload"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="endDateFilterDownload"
                class="border rounded px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>
          <select v-model="timeFilterDownload" class="border rounded px-3 py-2">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3">Download Size</th>
              <th class="py-3 px-3">Details</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(entry, index) in downloadsReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ entry.date }}</td>
              <td class="py-2 px-3">{{ entry.download_size }}</td>
              <td class="py-2 px-3">
                <ul>
                  <li v-for="(detail, idx) in entry.details" :key="idx">
                    {{ detail.book_name }} - {{ detail.downloads }} downloads - {{ detail.size }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Reading Behavior Report -->
      <div class="mt-16">
        <h2 class="text-lg font-semibold mb-4">Reading Behavior Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="dateFilter"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="dateFilter"
                class="border rounded px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>
          <select v-model="timeFilter" class="border rounded px-3 py-2">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3">Reading Hours</th>
              <th class="py-3 px-3">Readers</th>
              <th class="py-3 px-3">Pages</th>
              <th class="py-3 px-3">Books</th>
              <th class="py-3 px-3">Completed Books</th>
            </tr>
          </template>
          <template #body>
            <tr
              v-for="(entry, index) in readingBehaviorReport"
              :key="index"
              class="border-b"
            >
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ entry.date }}</td>
              <td class="py-2 px-3">{{ entry.total_reading_hours }}</td>
              <td class="py-2 px-3">{{ entry.user_name }}</td>
              <td class="py-2 px-3">{{ entry.total_pages }}</td>
              <td class="py-2 px-3">{{ entry.total_books }}</td>
              <td class="py-2 px-3">{{ entry.completed_books }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Devices Report -->
      <div class="mt-16">
        <h2 class="text-lg font-semibold mb-4">Devices and Operating Systems Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="startDataFilterDevice"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="endDataFilterDevice"
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
              <th class="py-3 px-3">Device Type</th>
              <th class="py-3 px-3">Operating System</th>
              <th class="py-3 px-3">Books</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(entry, index) in devicesReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ entry.installation_date }}</td>
              <td class="py-2 px-3">{{ entry.device_type }}</td>
              <td class="py-2 px-3">{{ entry.os_type }}</td>
              <td class="py-2 px-3">{{ entry.book_count }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

    </div>
  </DefaultLayout>
</template>