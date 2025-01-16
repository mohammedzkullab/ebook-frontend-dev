<script setup>
import axios from 'axios';
import {ref} from "vue";
import {Auth} from "@/stores/Auth";
import router from "@/router/index";
import Preloader from "@/components/Preloader.vue";

const form = ref({
  username: '',
  password: '',
})

const validationMessage = ref('')

const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
    validationMessage.value = null
    await axios.post('login', {
      ...form.value
    }).then((res) => {
      const auth = Auth();
      auth.login(res.data.user)
      router.push({name: 'dashboard'})
    }).catch((err) => {
      validationMessage.value = err.response.data.message
    }).finally(() => loading.value = false);
}

const loading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = ! showPassword.value
}
</script>

<template>
  <Preloader :loading="loading"/>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-brown-300 to-brown-200">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105">
      <div class="flex justify-center mb-4">
        <img
          src="/src/assets/images/login.png"
          alt="AFAQ ALMAAREFA"
          class="h-16"
        />
      </div>

      <p class="text-center text-gray-500 mb-6">Login to your account</p>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="email">Email</label>
          <input
            v-model="form.username"
            id="email"
            type="text"
            placeholder="Enter your email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a57d53] focus:outline-none"
            required

          />
          <span class="text-red text-sm">{{ validationMessage }}</span>

        </div>

        <div class="mb-6 relative">
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="password">Password</label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Enter your password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a57d53] focus:outline-none"
            required
          />

          <span
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 mt-7 right-3 flex items-center cursor-pointer"
          >
            <svg
              class="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
            <g opacity="0.5">
              <path
                d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                fill=""
              />
              <path
                d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                fill=""
              />
            </g>
          </svg>
          </span>
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-[#3498ae] text-white font-semibold rounded-lg hover:bg-[#3498be] transition-all"
        >
          Login
        </button>
      </form>

      <div class="text-center mt-4">
        <RouterLink :to="{name: 'ForgotPassword'}" class="text-sm text-[#3498ae] hover:underline">Forgot your password?</RouterLink>
      </div>
    </div>
  </div>
</template>









