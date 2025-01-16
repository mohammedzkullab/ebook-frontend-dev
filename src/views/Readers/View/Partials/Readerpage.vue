<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HTTP from '@/apis/HTTP.js';
import router from '@/router'
import Preloader from "@/components/Preloader.vue";
import Datatable from '@/components/Dashboard/Datatable.vue'
import TimeAdapter from '@/components/Converter'

const route = useRoute();
const userId = route.params.id;
const loading = ref(false);

const form = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  status: '',
  created_at: '',
  country: '',
  email_verified_at: '',
  phone_verified_at: '',
  orders: [],
  favorites: [],
  libraries: []
});

const loadUserData = async () => {
  loading.value = true;
  try {
    const res = await HTTP.action(`users/${userId}`).withToken().get();
    const data = res.data.data;
    form.value = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      created_at: data.created_at,
      country: data.country,
      email_verified_at: data.email_verified_at,
      phone_verified_at: data.phone_verified_at,
      orders: data.orders,
      favorites: data.favorites,
      libraries: data.libraries
    };
  }finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserData();
});

const view = (id) => {
  router.push({ name: 'orders.view', params: { id: id } })
}
</script>
<template>
   <preloader :loading="loading"/>
  <div class="min-h-screen bg-gradient-to-r p-8">
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      <div
        class="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition-shadow duration-300 transform dark:border-strokedark dark:bg-boxdark dark:text-white hover:scale-105"
      >
        <div class="flex items-center">
          <div class="text-white rounded-full p-4 mr-4 bg-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14c2.5 0 4.5-2 4.5-4.5S14.5 5 12 5 7.5 7 7.5 9.5 9.5 14 12 14zM12 14c-4.5 0-8 2.5-8 6v2h16v-2c0-3.5-3.5-6-8-6z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">User Details</h3>
            <p class="text-gray-500" :class="form.name ? 'text-green' : 'text-red'">{{ form.name ?? 'Name not provided' }}</p>
            <p class="text-gray-500" :class="form.email ? 'text-green' : 'text-red'">{{ form.email ?? 'Email not provided' }}</p>
            <p class="text-gray-500" :class="form.phone ? 'text-green' : 'text-red'">{{ form.phone ?? 'Phone number not provided' }}</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition-shadow duration-300 transform dark:border-strokedark dark:bg-boxdark dark:text-white hover:scale-105"
      >
        <div class="flex items-center">
          <div class="text-white rounded-full p-4 mr-4 bg-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M3 8h18M4 21h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">Joined</h3>
            <p class="text-gray-500">{{ TimeAdapter.humanable(form.created_at) }}</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition-shadow duration-300 transform dark:border-strokedark dark:bg-boxdark dark:text-white hover:scale-105"
      >
        <div class="flex items-center">
          <div class="text-white rounded-full p-4 mr-4 bg-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="2 -2 22 22" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">Verified</h3>
            <p>
              Phone: <span v-if="form.phone_verified_at">{{ form.phone_verified_at }}</span>
              <span v-else :class="form.phone_verified_at ? 'text-green' : 'text-red'">Did not verify</span>
            </p>
            <p>
              Email: <span v-if="form.email_verified_at">{{ form.email_verified_at }}</span>
              <span :class="form.phone_verified_at ? 'text-green' : 'text-red'" v-else>Did not verify</span>
            </p>
          </div>

        </div>
      </div>

    </section>


    <h2 class="text-2xl font-bold text-gray-800 mb-6">User Orders</h2>
    <section class="bg-white shadow-lg p-6 rounded-xl mb-10 dark:border-strokedark dark:bg-boxdark">
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th class="py-4 px-6">NO</th>
              <th class="py-4 px-6">Order Date</th>
              <th class="py-4 px-6">Books</th>
              <th class="py-4 px-6">Total</th>
              <th scope="col" class="py-4 px-6" style="justify-items: center">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219C19.25 8.28437 19.1125 8.18124 19.0781 8.04374C19.0437 7.90624 18.975 7.80312 18.9406 7.66562C18.8719 7.52812 18.9406 7.39062 19.0437 7.28749L19.1125 7.21874C19.4906 6.87499 19.6969 6.39374 19.6969 5.87812C19.6969 5.36249 19.525 4.88124 19.1469 4.50312L17.8062 3.12812C17.0844 2.37187 15.8469 2.33749 15.0906 3.09374L14.9875 3.16249C14.8844 3.26562 14.7125 3.29999 14.5406 3.23124C14.4031 3.16249 14.2656 3.09374 14.0937 3.05937C13.9219 2.99062 13.8187 2.85312 13.8187 2.71562V2.54374C13.8187 1.47812 12.9594 0.618744 11.8937 0.618744H9.96875C9.45312 0.618744 8.97187 0.824994 8.62812 1.16874C8.25 1.54687 8.07812 2.02812 8.07812 2.50937V2.64687C8.07812 2.78437 7.975 2.92187 7.8375 2.99062C7.76875 3.02499 7.73437 3.02499 7.66562 3.05937C7.52812 3.12812 7.35625 3.09374 7.25312 2.99062L7.18437 2.88749C6.84062 2.50937 6.35937 2.30312 5.84375 2.30312C5.32812 2.30312 4.84687 2.47499 4.46875 2.85312L3.09375 4.19374C2.3375 4.91562 2.30312 6.15312 3.05937 6.90937L3.12812 7.01249C3.23125 7.11562 3.26562 7.28749 3.19687 7.39062C3.12812 7.52812 3.09375 7.63124 3.025 7.76874C2.95625 7.90624 2.85312 7.97499 2.68125 7.97499H2.57812C2.0625 7.97499 1.58125 8.14687 1.20312 8.52499C0.824996 8.86874 0.618746 9.34999 0.618746 9.86562L0.584371 11.7906C0.549996 12.8562 1.40937 13.7156 2.475 13.75H2.57812C2.75 13.75 2.8875 13.8531 2.92187 13.9906C2.99062 14.0937 3.05937 14.1969 3.09375 14.3344C3.12812 14.4719 3.09375 14.6094 2.99062 14.7125L2.92187 14.7812C2.54375 15.125 2.3375 15.6062 2.3375 16.1219C2.3375 16.6375 2.50937 17.1187 2.8875 17.4969L4.22812 18.8719C4.95 19.6281 6.1875 19.6625 6.94375 18.9062L7.04687 18.8375C7.15 18.7344 7.32187 18.7 7.49375 18.7687C7.63125 18.8375 7.76875 18.9062 7.94062 18.9406C8.1125 19.0094 8.21562 19.1469 8.21562 19.2844V19.4219C8.21562 20.4875 9.075 21.3469 10.1406 21.3469H12.0656C13.1312 21.3469 13.9906 20.4875 13.9906 19.4219V19.2844C13.9906 19.1469 14.0937 19.0094 14.2312 18.9406C14.3 18.9062 14.3344 18.9062 14.4031 18.8719C14.575 18.8031 14.7125 18.8375 14.8156 18.9406L14.8844 19.0437C15.2281 19.4219 15.7094 19.6281 16.225 19.6281C16.7406 19.6281 17.2219 19.4562 17.6 19.0781L18.975 17.7375C19.7312 17.0156 19.7656 15.7781 19.0094 15.0219L18.9406 14.9187C18.8375 14.8156 18.8031 14.6437 18.8719 14.5406C18.9406 14.4031 18.975 14.3 19.0437 14.1625C19.1125 14.025 19.25 13.9562 19.3875 13.9562H19.4906H19.525C20.5562 13.9562 21.4156 13.1312 21.45 12.0656L21.4844 10.1406C21.4156 9.72812 21.2094 9.21249 20.8656 8.86874ZM19.8344 12.1C19.8344 12.3062 19.6625 12.4781 19.4562 12.4781H19.3531H19.3187C18.5281 12.4781 17.8062 12.9594 17.5312 13.6469C17.4969 13.75 17.4281 13.8531 17.3937 13.9562C17.0844 14.6437 17.2219 15.5031 17.7719 16.0531L17.8406 16.1562C17.9781 16.2937 17.9781 16.5344 17.8406 16.6719L16.4656 18.0125C16.3625 18.1156 16.2594 18.1156 16.1906 18.1156C16.1219 18.1156 16.0187 18.1156 15.9156 18.0125L15.8469 17.9094C15.2969 17.325 14.4719 17.1531 13.7156 17.4969L13.5781 17.5656C12.8219 17.875 12.3406 18.5625 12.3406 19.3531V19.4906C12.3406 19.6969 12.1687 19.8687 11.9625 19.8687H10.0375C9.83125 19.8687 9.65937 19.6969 9.65937 19.4906V19.3531C9.65937 18.5625 9.17812 17.8406 8.42187 17.5656C8.31875 17.5312 8.18125 17.4625 8.07812 17.4281C7.80312 17.2906 7.52812 17.2562 7.25312 17.2562C6.77187 17.2562 6.29062 17.4281 5.9125 17.8062L5.84375 17.8406C5.70625 17.9781 5.46562 17.9781 5.32812 17.8406L3.9875 16.4656C3.88437 16.3625 3.88437 16.2594 3.88437 16.1906C3.88437 16.1219 3.88437 16.0187 3.9875 15.9156L4.05625 15.8469C4.64062 15.2969 4.8125 14.4375 4.50312 13.75C4.46875 13.6469 4.43437 13.5437 4.36562 13.4406C4.09062 12.7187 3.40312 12.2031 2.6125 12.2031H2.50937C2.30312 12.2031 2.13125 12.0312 2.13125 11.825L2.16562 9.89999C2.16562 9.76249 2.23437 9.69374 2.26875 9.62499C2.30312 9.59062 2.40625 9.52187 2.54375 9.52187H2.64687C3.4375 9.55624 4.15937 9.07499 4.46875 8.35312C4.50312 8.24999 4.57187 8.14687 4.60625 8.04374C4.91562 7.35624 4.77812 6.49687 4.22812 5.94687L4.15937 5.84374C4.02187 5.70624 4.02187 5.46562 4.15937 5.32812L5.53437 3.98749C5.6375 3.88437 5.74062 3.88437 5.80937 3.88437C5.87812 3.88437 5.98125 3.88437 6.08437 3.98749L6.15312 4.09062C6.70312 4.67499 7.52812 4.84687 8.28437 4.53749L8.42187 4.46874C9.17812 4.15937 9.65937 3.47187 9.65937 2.68124V2.54374C9.65937 2.40624 9.72812 2.33749 9.7625 2.26874C9.79687 2.19999 9.9 2.16562 10.0375 2.16562H11.9625C12.1687 2.16562 12.3406 2.33749 12.3406 2.54374V2.68124C12.3406 3.47187 12.8219 4.19374 13.5781 4.46874C13.6812 4.50312 13.8187 4.57187 13.9219 4.60624C14.6437 4.94999 15.5031 4.81249 16.0875 4.26249L16.1906 4.19374C16.3281 4.05624 16.5687 4.05624 16.7062 4.19374L18.0469 5.56874C18.15 5.67187 18.15 5.77499 18.15 5.84374C18.15 5.91249 18.1156 6.01562 18.0469 6.11874L17.9781 6.18749C17.3594 6.70312 17.1875 7.56249 17.4625 8.24999C17.4969 8.35312 17.5312 8.45624 17.6 8.55937C17.875 9.28124 18.5625 9.79687 19.3531 9.79687H19.4562C19.5937 9.79687 19.6625 9.86562 19.7312 9.89999C19.8 9.93437 19.8344 10.0375 19.8344 10.175V12.1Z" fill=""></path>
                  <path d="M11 6.32498C8.42189 6.32498 6.32501 8.42186 6.32501 11C6.32501 13.5781 8.42189 15.675 11 15.675C13.5781 15.675 15.675 13.5781 15.675 11C15.675 8.42186 13.5781 6.32498 11 6.32498ZM11 14.1281C9.28126 14.1281 7.87189 12.7187 7.87189 11C7.87189 9.28123 9.28126 7.87186 11 7.87186C12.7188 7.87186 14.1281 9.28123 14.1281 11C14.1281 12.7187 12.7188 14.1281 11 14.1281Z" fill=""></path>
                </svg>
              </th>
            </tr>
          </template>
          <template #body>
            <tr class="border-b border-[#f9fbfc]" v-for="(item, index) in form.orders" :key="index">
              <td class="py-4 px-8">{{ item.id }}</td>
              <td class="py-4 px-8"></td>
              <td class="py-4 px-8"></td>
              <td class="py-4 px-8">{{ item.grand_total_price }}</td>
              <td class="py-2 text-center">
                <button @click="view(item.id)" class="p-2 rounded-full hover:bg-gray-200 hover:text-primary transition duration-200">
                  <svg class="fill-current text-gray-600" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7.305 4.5 3.169 7.381 1.5 12c1.669 4.619 5.805 7.5 10.5 7.5s8.831-2.881 10.5-7.5C20.831 7.381 16.695 4.5 12 4.5zm0 12.5c-3.589 0-6.536-2.487-7.826-6C5.464 7.487 8.411 5 12 5s6.536 2.487 7.826 6c-1.29 3.513-4.237 6-7.826 6zm0-10a4 4 0 100 8 4 4 0 000-8zm0 6.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
                  </svg>
                </button>
              </td>
            </tr>
          </template>
        </Datatable>
    </section>

    <h2 class="text-2xl font-bold text-gray-800 mb-6">Favorite Books</h2>
    <section class="bg-white shadow-lg p-6 rounded-xl mb-10 dark:border-strokedark dark:bg-boxdark dark:text-white">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="(item, index) in form.favorites" :key="index"
          class="bg-[#fcfcfc] dark:bg-meta-4 p-4 rounded-lg shadow-lg transition-transform hover:scale-105">
          <img :src="item.images[0].original_url" :alt="book.name" class="w-full h-48 object-cover mb-4 rounded-lg" />
          <h3 class="text-lg font-bold text-gray-700">{{ item.name }}</h3>
          <p class="text-gray-500">{{ item.author.name }}</p>
        </div>
      </div>
    </section>

    <h2 class="text-2xl font-bold text-gray-800 mb-6">Currently Reading</h2>
    <section class="bg-white shadow-lg p-6 rounded-xl mb-10 dark:border-strokedark dark:bg-boxdark dark:text-white">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="(item, index) in form.libraries" :key="index"
          class="bg-[#fcfcfc] dark:bg-meta-4 p-4 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          <img :src="item.images[0].original_url" :alt="book.name" class="w-full h-48 object-cover mb-4 rounded-lg" />
          <h3 class="text-lg font-bold text-gray-700">{{ item.name }}</h3>
          <p class="text-gray-500">{{ item.author.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>