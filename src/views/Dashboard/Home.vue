<script setup lang="ts">
import DataStatsOne from '@/components/DataStats/DataStatsOne.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ChartTwo from '@/components/Charts/ChartTwo.vue';
import ChartThree from '@/components/Charts/ChartThree.vue';
import UserTable  from '@/components/Tables/UsersTable.vue'; //users
import TableTwo from '@/components/Tables/TableTwo.vue' //10 oreders
import TableFor from '@/components/Tables/TableFor.vue'
import { ref, onMounted, watch } from 'vue';

import HTTP from '@/apis/HTTP.js';

const statistics = ref([]);
const loading = ref(false);
const filteredOrders = ref([]);
const timeFilterOrder = ref('latest_order_month');

const fetchFilteredOrders = () => {
  loading.value = true;
  HTTP.action(`reports/home?${timeFilterOrder.value}=true`)
    .withToken()
    .get()
    .then((res: any) => {
      filteredOrders.value = res.data.data.latest_filter;
    })
    .catch((err: any) => {
      alert(err);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loading.value = true;
  HTTP.action('reports/home')
    .withToken()
    .get()
    .then((res: any) => {
      statistics.value = res.data.data;
      filteredOrders.value = res.data.data.latest_filter;
    })
    .catch((err: any) => {
      alert(err);
    })
    .finally(() => {
      loading.value = false;
    });
});

watch(timeFilterOrder, fetchFilteredOrders);

</script>

<template>
  <DefaultLayout :loading="loading">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <DataStatsOne :carts="statistics.carts_count" :orders="statistics.orders_count" :users="statistics.users_count" :books="statistics.books_count"/>
    </div>


      <div class="mt-5 col-span-12 md:col-span-6">
        <UserTable :users="statistics.latest_users" :most_purchased_users="statistics.most_purchased_users"/>
      </div>


     <div class="mt-5 col-span-12 md:col-span-6 flex flex-row gap-4">
       <div class="basis-3/4 flex-grow">
        <ChartTwo />
       </div>
       <div class="basis-2/4 flex-grow">
        <ChartThree />
       </div>
    </div>


    <div class="col-span-12 md:col-span-4 mt-4">
      <TableTwo  :orders="statistics.latest_order"/>
    </div>
    <div class="col-span-12 md:col-span-4 mt-4">
      <TableFor :orders="filteredOrders" :timeFilterOrder="timeFilterOrder" @update:timeFilterOrder="timeFilterOrder = $event" />
    </div>

  </DefaultLayout>
</template>

