<script setup lang="ts">
import TimeAdapter from "@/components/Converter.js"

defineProps({
  users: {
    type: Object,
    default: null
  },
  most_purchased_users: {
    type: Object,
    default: null
  }
})

</script>

<template>
  <div class="container">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">User Overview</h2>

    <div class="mt-8 bg-white rounded-lg shadow p-4 dark:border-strokedark dark:bg-boxdark">
      <h3 class="text-xl text-gray-700">Latest 5 Users</h3>
      <div class="border-t border-gray-300 mt-2">
        <div class="grid grid-cols-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-2 md:px-6 2xl:px-7.5">
          <div class="flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">Username</p>
          </div>
          <div class="flex items-center">
            <p class="font-medium text-black dark:text-white">Registration Date</p>
          </div>
        </div>
          <div v-for="(item, index) in users" :key="index" class="grid grid-cols-2 border-t border-b border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-2 md:px-6 2xl:px-7.5">
            <div class="text-gray-600 dark:text-white">{{ item?.name ?? '-' }}</div>
            <div class="text-gray-600 dark:text-white">{{ TimeAdapter.humanable(item?.created_at) }}</div>
          </div>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-lg shadow p-4 dark:border-strokedark dark:bg-boxdark">
      <h3 class="text-xl text-gray-700">Top 5 Buyers</h3>
      <div class="border-t border-gray-300 mt-2">
        <div class="grid grid-cols-3 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-3 md:px-6 2xl:px-7.5">
          <div class="flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">Username</p>
          </div>
          <div class="flex items-center">
            <p class="font-medium text-black dark:text-white">Number of Orders</p>
          </div>
          <div class="flex items-center">
            <p class="font-medium text-black dark:text-white">Total Purchases</p>
          </div>
        </div>
        <div v-for="(item, index) in most_purchased_users" :key="index" class="grid grid-cols-3 border-t border-b border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-3 md:px-6 2xl:px-7.5">
          <div class="text-gray-600 dark:text-white">{{ item.name }}</div>
          <div class="text-gray-600 dark:text-white">{{ item?.orders_count ?? 0 }}</div>
          <div class="text-gray-600 dark:text-white">${{ item?.orders_sum_grand_total_price ?? 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>


