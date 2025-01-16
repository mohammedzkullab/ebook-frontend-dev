<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-brown-300 to-brown-200">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105">
      <div class="flex justify-center mb-4">
        <img
          src="/src/assets/images/login.png"
          alt="AFAQ ALMAAREFA"
          class="h-16"
        />
      </div>
      <p class="text-center text-gray-500 mb-6">Forgot Your Password?</p>

      <form @submit.prevent="handleForgotPassword">
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a57d53] focus:outline-none"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="mobile">Mobile Number</label>
          <input
            v-model="mobile"
            id="mobile"
            type="text"
            placeholder="Enter your mobile number"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a57d53] focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-[#3498ae] text-white font-semibold rounded-lg hover:bg-[#3498be] transition-all"
        >
          Send Reset Link
        </button>
      </form>
      <div class="text-center mt-4">
        <RouterLink :to="{name: 'login'}" class="text-sm text-[#3498ae] hover:underline">Back to Login</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      mobile: '',
    };
  },
  methods: {
    async handleForgotPassword() {
      try {
        const response = await axios.post('/forget-password', {
          email: this.email,
          mobile: this.mobile,
        });

        if (response.data.success) {
          alert('A password reset link has been sent to your email.');
        } else {
          alert('The provided email and mobile number do not match our records.');
        }
      } catch (error) {
        console.error('Error sending password reset link:', error);
        alert('An error occurred. Please try again later.');
      }
    },
  },
};
</script>


