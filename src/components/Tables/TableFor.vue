<script setup lang="ts">

defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  timeFilterOrder: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:timeFilterOrder']);

const handleFilterChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit('update:timeFilterOrder', value);
};
</script>


<template>
  <div class="mt-8 bg-white rounded-lg shadow p-4 dark:border-strokedark dark:bg-boxdark">
    <div class="flex justify-between items-center mb-4">
      <!-- Heading -->
      <h3 class="text-xl font-semibold text-gray-700">Orders</h3>

      <!-- Filter Options -->
      <div>
        <select :value="timeFilterOrder" @change="handleFilterChange" class="border rounded px-3 py-2">
          <option value="latest_order_day">Daily</option>
          <option value="latest_order_week">Weekly</option>
          <option value="latest_order_month">Monthly</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
      <div class="flex items-center">
        <p class="text-sm font-medium text-black dark:text-white">Order Number</p>
      </div>
      <div class="flex items-center">
        <p class="font-medium text-black dark:text-white">Username</p>
      </div>
      <div class="flex items-center">
        <p class="font-medium text-black dark:text-white">Order Date</p>
      </div>
      <div class="flex items-center">
        <p class="font-medium text-black dark:text-white">Books Count</p>
      </div>
      <div class="flex items-center">
        <p class="font-medium text-black dark:text-white">Order Total</p>
      </div>
    </div>

    <!-- Table Rows -->
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="grid grid-cols-5 border-t border-b border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
    >
      <div class="text-gray-600 dark:text-white">{{ order?.id }}</div>
      <div class="text-gray-600 dark:text-white">{{ order?.user?.user?.name }}</div>
      <div class="text-gray-600 dark:text-white">{{ order?.created_at }}</div>
      <div class="text-gray-600 dark:text-white">{{ order?.items_count }}</div>
      <div class="text-gray-600 dark:text-white">${{ order?.grand_total_price }}</div>
    </div>
  </div>
</template>