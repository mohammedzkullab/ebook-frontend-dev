<script setup lang="ts">

defineProps({
  orders: {
    type: Object,
    default: null
  }
})

</script>

<template>
  <div class="mt-8 bg-white rounded-lg shadow p-4 dark:border-strokedark dark:bg-boxdark">
    <h3 class="text-xl font-semibold text-gray-700">Top 5 Buyers</h3>
    <div class="border-t border-gray-300 mt-2">
      <div class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
        <div class="flex items-center">
          <p class="text-sm font-medium text-black dark:text-white">Username & Email</p>
        </div>
        <div class="flex items-center">
          <p class="font-medium text-black dark:text-white">Country</p>
        </div>
        <div class="flex items-center">
          <p class="font-medium text-black dark:text-white">Date</p>
        </div>
        <div class="flex items-center">
          <p class="font-medium text-black dark:text-white">Books Ordered</p>
        </div>
        <div class="flex items-center">
          <p class="font-medium text-black dark:text-white">Order Total</p>
        </div>
      </div>
      <div v-for="(order, index) in orders" :key="index" class="grid grid-cols-5 border-t border-b border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
        <div class="text-gray-600 dark:text-white">{{ order?.user?.user?.name }} <br> <span class="text-xs">{{ order?.user?.user?.email }}</span></div>
        <div class="text-gray-600 dark:text-white">{{ order?.user?.user.country?.name }}</div>
        <div class="text-gray-600 dark:text-white">{{ order?.created_at }}</div>
        <div class="text-gray-600 dark:text-white">{{ order?.items_count }}</div>
        <div class="text-gray-600 dark:text-white">${{ order?.grand_total_price }}</div>
      </div>
    </div>
  </div>
</template>
