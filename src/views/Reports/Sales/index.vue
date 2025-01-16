<script setup>
import { ref, onMounted, watch } from 'vue';
import HTTP from '@/apis/HTTP.js';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Datatable from '@/components/Dashboard/Datatable.vue';

const loading = ref(false);

const ordersReport = ref([]);
const discountCodesReport = ref([]);
const paymentGatewaysReport = ref([]);

const start_dateCoupon = ref('');
const end_dateCoupon = ref('');

const dateFilter= ref('');
const timeFilter = ref('daily');

const OrdersReport = async () => {
  loading.value = true;

  try {
    const response = await HTTP.action('reports/order').withToken().get({
      params: {
        start_date: dateFilter.value || new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        period: timeFilter.value,
      },
    });

    const data = response.data.data;

    ordersReport.value = data.daily_data.map((item) => ({
      date: item.date,
      daily_data: item.daily_quantity,
      daily_sales: item.daily_sales,
      total_tax: item.total_tax || 0,
      totalDiscount: 0,
      netSales: item.daily_sales - (item.total_tax || 0),
    }));
  } catch (error) {
    console.error('Error fetching orders report:', error);
  } finally {
    loading.value = false;
  }
};

const DiscountCodesReport = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('reports/coupon')
      .withToken()
      .withQuery({
        start_date: start_dateCoupon.value || null,
        end_date: end_dateCoupon.value || null,
      })
      .get();
    const data = response.data.data;
    discountCodesReport.value = data.map((item) => ({
      code: item.code,
      usage_count: item.usage_count,
      user_count: item.user_count,
      status: item.status,
      activation_date: item.activation_date,
      total_sales: item.total_sales,
      total_discount: item.total_discount,
    }));
  } catch (error) {
    console.error('Error fetching discount codes report:', error);
  } finally {
    loading.value = false;
  }
};

const PaymentGatewaysReport = async () => {
  loading.value = true;

  try {
    const response = await HTTP.action('reports/payment').withToken().get({
      params: {
        start_date: dateFilter.value || new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        period: timeFilter.value,
      },
    });

    const data = response.data.data;
    paymentGatewaysReport.value = data.map((item) => ({
      date: item.date,
      gateway_name: item.gateway_name,
      total_sales: item.total_sales,
      user_count: item.user_count,
    }));
  } catch (error) {
    console.error('Error fetching payment gateways report:', error);
  } finally {
    loading.value = false;
  }
};

watch([start_dateCoupon, end_dateCoupon], DiscountCodesReport, { immediate: true });

onMounted(() => {
  OrdersReport();
  PaymentGatewaysReport();
  DiscountCodesReport();
});
</script>

<template>
  <DefaultLayout :loading="loading">
    <BreadcrumbDefault :pageTitle="'Sales'" />
    <div class="flex flex-col gap-10">
      <div class="pt-6 pb-2.5 dark:border-strokedark xl:pb-1">
        <h2 class="text-lg font-semibold mb-4">Orders Report</h2>
        <div class="flex justify-between items-center mb-4">
          <input
            type="date"
            v-model="dateFilter"
            class="border rounded px-3 py-2"
            placeholder="Filter by Date"
          />
          <select v-model="timeFilter" class="border rounded px-3 py-2">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">No</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3">Total Books</th>
              <th class="py-3 px-3">Total Sales</th>
              <th class="py-3 px-3">Total Tax</th>
              <th class="py-3 px-3">Total Discount</th>
              <th class="py-3 px-3">Net Sales</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(order, index) in ordersReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ order.start_date }}</td>
              <td class="py-2 px-3">{{ order.total_quantity }}</td>
              <td class="py-2 px-3">{{ order.total_sales }}</td>
              <td class="py-2 px-3">{{ order.total_tax }}</td>
              <td class="py-2 px-3">{{ order.total_shipping }}</td>
              <td class="py-2 px-3">{{ order.netSales }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <div class="mt-14">
        <h2 class="text-lg font-semibold mb-4 ">Discount Codes Report</h2>
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-4">
            <div>
              <label for="start_date">Start Date: </label>
              <input
                type="date"
                v-model="start_dateCoupon"
                class="border rounded px-3 py-2"
                placeholder="Start Date"
              />
            </div>

            <div>
              <label for="end_date">End Date: </label>
              <input
                type="date"
                v-model="end_dateCoupon"
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
              <th class="py-3 px-3">Code</th>
              <th class="py-3 px-3">Usage Count</th>
              <th class="py-3 px-3">User Count</th>
              <th class="py-3 px-3">Status</th>
              <th class="py-3 px-3">Activation Date</th>
              <th class="py-3 px-3">Total Sales</th>
              <th class="py-3 px-3">Total Discount</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(discount, index) in discountCodesReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ discount.code }}</td>
              <td class="py-2 px-3">{{ discount.usage_count }}</td>
              <td class="py-2 px-3">{{ discount.user_count }}</td>
              <td class="py-2 px-3">{{ discount.status }}</td>
              <td class="py-2 px-3">{{ discount.activation_date }}</td>
              <td class="py-2 px-3">{{ discount.total_sales }}</td>
              <td class="py-2 px-3">{{ discount.total_discount }}</td>
            </tr>
          </template>
        </Datatable>
      </div>

      <!-- Payment Gateways Report -->
      <div class="mt-16">
        <h2 class="text-lg font-semibold mb-4">Payment Gateways Report</h2>
        <div class="flex justify-between items-center mb-4">
          <input
            type="date"
            v-model="dateFilter"
            class="border rounded px-3 py-2"
            placeholder="Filter by Date"
          />
          <select v-model="timeFilter" class="border rounded px-3 py-2">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-3" style="width: 5%;">NO</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3">Gateway</th>
              <th class="py-3 px-3">Total Sales</th>
              <th class="py-3 px-3">User Count</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="(payment, index) in paymentGatewaysReport" :key="index" class="border-b">
              <td class="py-2 px-3">{{ index + 1 }}</td>
              <td class="py-2 px-3">{{ payment.date }}</td>
              <td class="py-2 px-3">{{ payment.gateway_name }}</td>
              <td class="py-2 px-3">{{ payment.total_sales }}</td>
              <td class="py-2 px-3">{{ payment.user_count }}</td>
            </tr>
          </template>
        </Datatable>
      </div>
    </div>
  </DefaultLayout>
</template>