<script setup lang="ts">
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HTTP from '@/apis/HTTP.js';
import router from '@/router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Preloader from '@/components/Preloader.vue'

const route = useRoute();
const orderId = route.params.id
const loading = ref(false);

const orderDetails = ref(null);

const loadOrder = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action(`orders/${orderId}`).withToken().get()
    orderDetails.value = response.data?.data;
  }finally {
    loading.value = false;
  }
};

const back = () => {
  router.push({name: 'Purchase-Orders.index'})
};

onMounted(() => {
  loadOrder()
})

</script>

<template>
  <preloader :loading="loading"/>

  <div class="p-6" id="app">
    <div class="flex items-center mb-4">
      <i
        class="fas fa-arrow-left text-gray-500 mr-2 cursor-pointer"
        @click="back"
      ></i>
    </div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Order Detail</h1>
      <div class="flex items-center space-x-2">
        <span class="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-sm">
          Processed
        </span>
        <span class="text-gray-500"> NO: {{ orderId }} </span>
      </div>
      <div class="flex space-x-2">
        <PrimaryButton> Print </PrimaryButton>
        <PrimaryButton> Canceled </PrimaryButton>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Summary</h2>
            <div class="flex items-center space-x-2 text-gray-500">
              <i class="far fa-calendar-alt"> </i>
              <span> Jul 27, 2024 at 05:11 </span>
            </div>
          </div>
          <div v-for="(item, index) in orderDetails?.items ?? []" :key="index">
            <div class="flex items-center mb-4">
              <img
                :alt="item?.book?.name"
                class="w-14 h-auto rounded object-cover"
                :src="item?.book?.main_image?.original_url"
              />
              <div>
                <h3 class="font-semibold">{{ item?.book?.name }}</h3>
                <p class="text-gray-500">{{ item?.book?.sku }}</p>
              </div>
              <div class="ml-auto text-right">
                <p class="font-semibold">{{ item?.book?.price }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-lg font-semibold mb-4">Payment</h2>
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="text-gray-500">Coupon</p>
              <p class="text-gray-500">Discount Price</p>
              <p class="text-gray-500">Tax Price</p>
              <p class="text-gray-500">Total Tax Price</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">Discount Type</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ orderDetails?.coupon?.code ?? '-' }}</p>
              <p class="font-semibold">{{ orderDetails?.total_price_discount ?? '-' }}</p>
              <p class="font-semibold">{{ orderDetails?.tax_price ?? '-' }}</p>
              <p class="font-semibold">{{ orderDetails?.tax_price ?? '-' }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-gray-500">Grand Total</p>
            <p class="font-semibold text-lg">{{ orderDetails?.grand_total_price }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Timeline</h2>
          <div class="flex items-center mb-4">
            <img
              alt="User avatar"
              class="w-8 h-8 rounded-full mr-4"
              height="30"
              src="https://storage.googleapis.com/a1aa/image/Y6TXsEqIb7qbHB8omW4m2FMyXaSW4wp4m0avfBUFAouiMU2JA.jpg"
              width="30"
            />
            <input
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Leave a comment..."
              type="text"
            />
            <button class="bg-gray-100 text-gray-500 px-4 py-2 rounded ml-2">Post</button>
          </div>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <i class="fas fa-circle text-gray-500"> </i>
              </div>
              <div>
                <p class="text-gray-500">27 July 2024</p>
                <p class="font-semibold">Order created</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <i class="fas fa-circle text-gray-500"> </i>
              </div>
              <div>
                <p class="text-gray-500">00:20</p>
                <p class="font-semibold">Waiting for payment gateway response</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <i class="fas fa-circle text-gray-500"> </i>
              </div>
              <div>
                <p class="text-gray-500">00:20</p>
                <p class="font-semibold">Payment Successful</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Customer</h2>
          <div class="flex items-center mb-4">
            <img
              alt="Billing address avatar"
              class="w-8 h-8 rounded-full mr-4"
              height="50"
              :src="orderDetails?.user?.user?.image?.original_url || '/src/assets/images/user/user-13.png'"
              width="50"
            />
            <div>
              <p class="font-semibold">{{ orderDetails?.user?.user?.name }}</p>
              <p class="text-gray-500">{{ orderDetails?.user?.user?.email }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Shipping Address</h2>
          <div class="flex items-center mb-4">
            <img
              alt="Billing address avatar"
              class="w-8 h-8 rounded-full mr-4"
              height="50"
              :src="orderDetails?.user?.user?.image?.original_url || '/src/assets/images/user/user-13.png'"
              width="50"
            />
            <div>
              <p class="font-semibold">{{ orderDetails?.user?.user?.name ?? '-' }}</p>
              <p class="text-gray-500">{{ orderDetails?.user?.user?.email ?? '-' }}</p>
            </div>
          </div>
          <div class="mb-4">
            <p class="text-gray-500">Phone: <span class="text-gray-500">
              {{ orderDetails?.user?.user?.phone ?? '-' }}
            </span></p>

          </div>
          <div>
            <p class="text-gray-500">Address: <span class="font-semibold">
              {{ orderDetails?.user?.user?.country?.name ?? '-' }}
            </span></p>

          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Billing Address</h2>
          <div class="flex items-center mb-4">
            <img
              alt="Billing address avatar"
              class="w-8 h-8 rounded-full mr-4"
              height="50"
              :src="orderDetails?.user?.user?.image?.original_url || '/src/assets/images/user/user-13.png'"
              width="50"
            />
            <div>
              <p class="font-semibold">{{ orderDetails?.user?.user?.name }}</p>
              <p class="text-gray-500">{{ orderDetails?.user?.user?.email }}</p>
            </div>
          </div>
          <div class="mb-4">
            <p class="text-gray-500">Phone: <span class="text-gray-500">
              {{ orderDetails?.user?.user?.phone ?? '-' }}
            </span></p>

          </div>
          <div>
            <p class="text-gray-500">Address: <span class="font-semibold">
              {{ orderDetails?.user?.user?.country?.name ?? '-' }}
            </span></p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>