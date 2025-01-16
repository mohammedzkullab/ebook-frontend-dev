<script setup>
import { Auth } from '@/stores/Auth'
import { onMounted, ref } from 'vue'
import PrimaryButton from './Buttons/PrimaryButton.vue'
import HTTP from '@/apis/HTTP.js'
import Preloader from '@/components/Preloader.vue'
import router from "@/router/index";

const errors = ref({})
const loading = ref(null)
const adminId = JSON.parse(Auth().user)?.id;

const form = ref({
  name: '',
  email: '',
  password: ''
})

const loadAdminData = async () => {
  loading.value = true;
  try {
    const res = await HTTP.action(`admins/${adminId}`).withToken().get();
    const data = res.data.data;
    form.value = {
      name: data.name,
      email: data.email,
    };
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const saveUser = async () => {
  const formData = new FormData()
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== '') {
      formData.append(key, value)
    }
  })
  await HTTP.action('profiles').withToken().post(formData).then(res => {
    window.location.reload();
  }).catch(err => {
    errors.value = err.response.data.errors;
  });
}

onMounted(() => {
  loadAdminData();
});

</script>
<template>
  <preloader :loading="loading"/>
  <div
    class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="relative z-20 h-35 md:h-65">
      <img
        src="/src/assets/images/cover/cover-01.png"
        alt="profile cover"
        class="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
      />
    </div>
    <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
      <div
        class="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3"
      >
        <img
          src="/src/assets/images/user/user-13.png"
          alt="profile image"
          class="rounded-full h-full w-full object-cover"
        />
      </div>

      <div v-if="!isEditing">
        <h3 class="mb-1.5 text-2xl font-medium text-black dark:text-white">{{ form.name }}</h3>
        <p class="text-lg text-gray-500 dark:text-gray-300">{{ form.email }}</p>

        <button @click="toggleEdit" class="hover:text-primary">
          <svg
            class="fill-current"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="currentColor" />
            <path
              d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.61L18.39 3.29C18 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div v-else class="mt-4 text-left">
        <label class="block text-black dark:text-white mb-2">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="mb-4 p-2 border rounded w-full dark:bg-gray-800"
          placeholder="Enter your name"
        />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>

        <label class="block text-black dark:text-white mb-2">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="mb-4 p-2 border rounded w-full dark:bg-gray-800"
          placeholder="Enter your email"
        />
        <span v-if="errors.email" class="text-red font-bold text-xs">{{ errors.email?.join() }}</span>

        <label class="block text-black dark:text-white mb-2">Password</label>
        <input
          v-model="form.password"
          type="password"
          class="mb-4 p-2 border rounded w-full dark:bg-gray-800"
          placeholder="Enter a new password"
        />
        <!-- <span v-if="errors.password" class="text-red font-bold text-xs">{{ errors.password?.join() }}</span> -->

        <div class="flex justify-center space-x-4">
          <PrimaryButton @click="saveUser" class="text-white rounded"> Save Changes </PrimaryButton>
          <PrimaryButton @click="toggleEdit" class="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
