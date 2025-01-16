<script setup>
import { ref, onMounted } from 'vue';
import HTTP from '@/apis/HTTP.js';
import '@/assets/css/style.css'
const isOpen = ref(false);
const notifications = ref([]);
import TimeAdapter from '@/components/Converter'

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const loadNotifications = async () => {
  try {
    const response = await HTTP.action('notifications').withToken().paginate();
    notifications.value = response.data.data;
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
};

const markAsRead = async (notificationId) => {
  try {
    await HTTP.action(`notifications/${notificationId}`).withToken().put();
    await loadNotifications();
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

onMounted(() => {
  loadNotifications();
});
</script>

<template>
  <div class="relative">
    <!-- Notification Button -->
    <button @click="toggleDropdown" class="btn relative">
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 22c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm6-6v-5c0-2.748-1.51-5.087-4-5.906V4c0-.552-.448-1-1-1s-1 .448-1 1v1.094C7.51 5.913 6 8.252 6 11v5l-2 2v1h16v-1l-2-2z"
        />
      </svg>
      <span
        v-if="notifications?.length"
        class="absolute -top-1 -right-1 bg-red text text-s font-bold rounded-full h-4 w-4 flex items-center justify-center text-white text-xs"
      >
        {{ notifications.length }}
      </span>
    </button>

    <!-- Dropdown Container -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-10 border border-gray-200 transition-opacity duration-200 ease-in-out"
    >
      <!-- Header -->
      <div class="bg-white text font-bold p-4 rounded-t-xl" style="border-bottom: 2px solid #000;">
        Notifications
      </div>

      <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto custom-scroll">
        <li v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          No notifications yet.
        </li>

        <li
          v-for="(item, index) in notifications"
          :key="index"
          class="p-4 hover:bg-gray-100 flex items-start justify-between"
        >
          <div class="flex items-start">
            <img
              :src="item.data.image || '/src/assets/images/user/user-13.png'"
              alt="Notification"
              class="w-10 h-10 rounded-full mr-4 object-cover self-center"
            />
            <div>
              <p class="text-xs font-bold text-gray-800">{{ item.data.title }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.data.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ TimeAdapter.humanable(item.created_at) }}</p>
            </div>
          </div>

          <div class="flex items-center justify-center self-center">
            <button
              @click="markAsRead(item.id)"
              class="text-red-500 text-lg font-semibold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200"
            >
              <i class="fas fa-check-circle text-xl"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


