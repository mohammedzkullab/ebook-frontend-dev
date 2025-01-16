<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null,
      orders: [],
      favoriteBooks: [],
      currentlyReading: [],
      userDetails: [
        {
          label: "Joined",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14c2.5 0 4.5-2 4.5-4.5S14.5 5 12 5 7.5 7 7.5 9.5 9.5 14 12 14zM12 14c-4.5 0-8 2.5-8 6v2h16v-2c0-3.5-3.5-6-8-6z" />
                </svg>`,
          iconBg: "bg-blue-500",
          value: "",
        },
        {
          label: "Last Login",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="2 -2 22 22" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`,
          iconBg: "bg-green-500",
          value: "",
        },
        {
          label: "Date of Birth",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M3 8h18M4 21h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
                </svg>`,
          iconBg: "bg-yellow-500",
          value: "",
        },
      ],
    };
  },
  mounted() {
    this.fetchUserData();
    this.fetchOrders();
    this.fetchFavoriteBooks();
    this.fetchCurrentlyReading();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get("/api/user");
        this.user = response.data;
        this.userDetails[0].value = this.user.joined;
        this.userDetails[1].value = this.user.lastLogin;
        this.userDetails[2].value = this.user.dateOfBirth;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchOrders() {
      try {
        const response = await axios.get("/api/user/orders");
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async fetchFavoriteBooks() {
      try {
        const response = await axios.get("/api/user/favorite-books");
        this.favoriteBooks = response.data;
      } catch (error) {
        console.error("Error fetching favorite books:", error);
      }
    },
    async fetchCurrentlyReading() {
      try {
        const response = await axios.get("/api/user/currently-reading");
        this.currentlyReading = response.data;
      } catch (error) {
        console.error("Error fetching currently reading books:", error);
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-r p-8">
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      <div
        v-if="user"
        v-for="(item, index) in userDetails"
        :key="index"
        class="bg-white shadow-lg p-6 rounded-xl hover:shadow-2xl transition-shadow duration-300 transform dark:border-strokedark dark:bg-boxdark dark:text-white hover:scale-105"
      >
        <div class="flex items-center">
          <div :class="item.iconBg" class="text-white rounded-full p-4 mr-4" v-html="item.icon"></div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">{{ item.label }}</h3>
            <p class="text-gray-500">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>


    <section v-if="orders.length" class="bg-white shadow-lg p-6 rounded-xl mb-10 dark:border-strokedark dark:bg-boxdark">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">User Orders</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead>
          <tr class="text-left bg-blue-200 text-gray-700 uppercase text-sm dark:bg-meta-4 leading-normal">
            <th class="py-4 px-6">Order #</th>
            <th class="py-4 px-6">Order Link</th>
            <th class="py-4 px-6">Order Date</th>
            <th class="py-4 px-6">Books</th>
            <th class="py-4 px-6">Total</th>
          </tr>
          </thead>
          <tbody class="text-gray-600 text-sm dark:bg-boxdark dark:text-white">
          <tr v-for="order in orders" :key="order.id" class="border-b border-gray-200 transition-colors duration-200">
            <td class="py-4 px-8">{{ order.id }}</td>
            <td class="py-4 px-8"><a :href="order.link" class="text-blue-600 hover:underline">View Order</a></td>
            <td class="py-4 px-8">{{ order.date }}</td>
            <td class="py-4 px-8">{{ order.books }}</td>
            <td class="py-4 px-8">{{ order.total }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>


    <section v-if="favoriteBooks.length" class="bg-white shadow-lg p-6 rounded-xl mb-10 dark:border-strokedark dark:bg-boxdark dark:text-white">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Favorite Books</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <div
          v-for="book in favoriteBooks"
          :key="book.id"
          class="bg-[#fcfcfc] dark:bg-meta-4 p-4 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          <img :src="book.image" :alt="book.title" class="w-full h-48 object-cover mb-4 rounded-lg" />
          <h3 class="text-lg font-bold text-gray-700">{{ book.title }}</h3>
          <p class="text-gray-500">{{ book.author }}</p>
        </div>
      </div>
    </section>


    <section v-if="currentlyReading.length" class="bg-white shadow-lg p-6 rounded-xl mb-10 dark:border-strokedark dark:bg-boxdark dark:text-white">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Currently Reading</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <div
          v-for="book in currentlyReading"
          :key="book.id"
          class="bg-[#fcfcfc] dark:bg-meta-4 p-4 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          <img :src="book.image" :alt="book.title" class="w-full h-48 object-cover mb-4 rounded-lg" />
          <h3 class="text-lg font-bold text-gray-700">{{ book.title }}</h3>
          <p class="text-gray-500">{{ book.author }}</p>
        </div>
      </div>
    </section>
  </div>
</template>