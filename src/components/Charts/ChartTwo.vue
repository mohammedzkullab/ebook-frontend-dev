<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HTTP from '@/apis/HTTP.js' 
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

// Reactive references for chart data and options
const chartData = ref({
  series: [
    { name: 'Search Count', data: [] },
    { name: 'Result Count', data: [] }
  ],
  labels: []
})

const chart = ref(null)

const apexOptions = ref({
  colors: ['#3056D3', '#80CAEE'],
  chart: {
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%'
          }
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last'
    }
  },
  dataLabels: { enabled: false },
  xaxis: { type: 'category', categories: [] },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: { radius: 99 }
  },
  fill: { opacity: 1 }
})

const fetchChartData = async () => {
  try {
    const responseSearchHistory = await HTTP.withToken().action('reports/search-history?filter=month').paginate();
    const apiData = responseSearchHistory.data.data;

    chartData.value.labels = apiData.data.map(item => item.keyword);
    chartData.value.series[0].data = apiData.data.map(item => item.search_count);
    chartData.value.series[1].data = apiData.data.map(item => item.result_count);

    apexOptions.value.xaxis.categories = chartData.value.labels;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};


const updateChart = () => {
  chart.value?.updateOptions({
    xaxis: { categories: chartData.value.labels }
  });
};

fetchChartData().then(updateChart);

onMounted(async () => {
  await fetchChartData();
  updateChart();
});


</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"
  >
    <div class="mb-4 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-xl font-bold text-black dark:text-white">Top Searched Words</h4>
      </div>
      <div></div>
    </div>

    <div>
      <div id="chartTwo" class="-ml-5 -mb-9">
        <VueApexCharts
          type="bar"
          height="335"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
  </div>
</template>