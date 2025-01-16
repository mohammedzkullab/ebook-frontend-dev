<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HTTP from '@/apis/HTTP.js'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

// Reactive references for chart data
const chartData = ref({
  series: [],
  labels: []
})

const chart = ref(null)

const apexOptions = ref({
  chart: {
    type: 'donut',
    width: 380
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#F5B041'],
  legend: {
    show: false,
    position: 'bottom'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200
        }
      }
    }
  ]
})

const fetchChartData = async () => {
  try {
    const responseSearchHistory = await HTTP.withToken().action('reports/search-history?filter=all').paginate();
    const apiData = responseSearchHistory.data.data;

    const topKeywords = apiData.data.slice(0, 5);
    chartData.value.labels = topKeywords.map(item => item.keyword);
    chartData.value.series = topKeywords.map(item => item.search_count);

    apexOptions.value.labels = chartData.value.labels;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};


onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5"
  >
    <div class="mb-3 justify-between gap-4 sm:flex">
      <h4 class="text-xl font-bold text-black dark:text-white">Top Keywords</h4>
    </div>
    <div class="mb-2">
      <div id="chartThree" class="mx-auto flex justify-center">
        <VueApexCharts
          type="donut"
          width="305"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
    <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3 pb-2.5">
      <!-- Use grid layout to control the number of columns -->
      <div
        v-for="(label, index) in chartData.labels"
        :key="index"
        class="w-full px-8 sm:w-1/2 md:w-1/3"
      >
      <div class="flex w-full items-center">
      <span
        class="mr-2 block h-3 w-full max-w-3 rounded-full"
        :style="{ backgroundColor: apexOptions.colors[index] }"
      ></span>
        <p class="flex w-full justify-between text-sm font-medium text-black dark:text-white">
          <span>{{ label }}</span>
          <span>{{ chartData.series[index] }}%</span>
        </p>
      </div>
    </div>
  </div>
  </div>
</template>