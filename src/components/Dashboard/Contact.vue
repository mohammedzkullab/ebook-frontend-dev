<script setup>
import axios from 'axios';
import {ref} from "vue";

const props = defineProps({
  apiEndpoint: {
    type: String,
    required: true
  }
});

const form = ref({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram:'',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
})

const submitForm = async () => {
  const contactData = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    whatsapp: form.value.whatsapp,
    address: form.value.address,
    socialMedia: form.value.socialMedia
  };

  try {
    const response = await axios.post(props.apiEndpoint, contactData);
    console.log('Contact added successfully:', response.data);
    resetForm();
  } catch (error) {
    console.error('Error adding contact:', error);
  }
}

const resetForm = () => {
  form.value.name = '';
  form.value.email = '';
  form.value.phone = '';
  form.value.whatsapp = '';
  form.value.address = '';
  form.value.socialMedia = {
    facebook: '',
    instagram:'',
    twitter: '',
    linkedin: '',
    youtube: ''
  };
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-8 bg-[#f3f8fd] dark:bg-[#24303f] rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8">Contact Information</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label for="name" class="block text-lg font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          placeholder="Enter the name"
          class="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label for="email" class="block text-lg font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Enter the email"
          class="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label for="phone" class="block text-lg font-medium text-gray-700">Phone Number</label>
        <div class="flex items-center mt-1">
          <span class="bg-gray-200 px-4 py-2 rounded-l-md">+966</span>
          <input
            type="tel"
            id="phone"
            v-model="form.phone"
            placeholder="Enter the phone number"
            class="block w-full border border-gray-300 rounded-r-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label for="whatsapp" class="block text-lg font-medium text-gray-700 flex items-center">
          WhatsApp
          <svg class="w-6 h-6 ml-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 2.13.56 4.12 1.54 5.85L0 24l6.3-1.55A11.98 11.98 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 22.08c-2.15 0-4.16-.64-5.85-1.75l-.42-.28-3.73.91.99-3.6-.3-.44A10.12 10.12 0 011.93 12c0-5.61 4.47-10.08 10.07-10.08S22.07 6.4 22.07 12c0 5.61-4.47 10.08-10.07 10.08zm5.62-7.6c-.32-.16-1.92-.95-2.22-1.06-.29-.11-.51-.16-.73.16-.21.32-.83 1.06-1.02 1.27-.19.21-.37.23-.68.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.6-1.88-1.78-2.2-.19-.32-.02-.49.14-.65.14-.13.32-.35.48-.53.16-.18.21-.31.32-.53.1-.21.05-.39-.02-.53-.08-.16-.73-1.77-1-2.42-.27-.65-.55-.55-.73-.56-.19 0-.4-.02-.62-.02-.21 0-.53.08-.8.39-.27.32-1.06 1.04-1.06 2.54 0 1.5 1.1 2.94 1.25 3.14.16.21 2.16 3.36 5.23 4.51.73.29 1.3.47 1.73.6.73.23 1.39.19 1.91.12.58-.09 1.9-.78 2.17-1.54.27-.77.27-1.44.19-1.54-.09-.08-.29-.13-.62-.27z"/></svg>
        </label>
        <div class="flex items-center mt-1">
          <span class="bg-gray-200 px-4 py-2 rounded-l-md">+966</span>
          <input
            type="tel"
            id="whatsapp"
            v-model="form.whatsapp"
            placeholder="Enter the WhatsApp number"
            class="block w-full border border-gray-300 rounded-r-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label for="address" class="block text-lg font-medium text-gray-700">Address</label>
        <textarea
          id="address"
          v-model="form.address"
          placeholder="Enter the address"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-lg font-medium text-gray-700">Social Media</label>
        <div class="flex space-x-4 mt-2">
          <div class="flex items-center space-x-2 w-full">
            <svg class="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.596 0 0 .596 0 1.326v21.349C0 23.404.596 24 1.325 24h11.494v-9.293H9.692v-3.631h3.127V8.416c0-3.1 1.893-4.788 4.66-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.505 0-1.796.715-1.796 1.765v2.314h3.591l-.468 3.631h-3.123V24h6.116c.729 0 1.325-.596 1.325-1.325V1.326C24 .596 23.404 0 22.675 0z"/></svg>
            <input
              v-model="form.socialMedia.facebook"
              placeholder="Facebook"
              type="url"
              class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex items-center space-x-2 w-full">

            <svg class="w-6 h-6 text-pink-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C8.743 0 8.332.014 7.052.073 5.77.132 4.905.347 4.26.665c-.69.337-1.258.78-1.815 1.337-.557.557-1 .624-1.337 1.814-.318.646-.533 1.51-.592 2.793C.014 8.332 0 8.743 0 12s.014 3.668.073 4.948c.06 1.283.275 2.148.592 2.793.337.69.78 1.258 1.337 1.814.557.558 1.125 1 1.815 1.338.646.318 1.51.533 2.793.592 1.281.06 1.692.073 4.948.073s3.668-.014 4.948-.073c1.283-.06 2.148-.275 2.793-.592.69-.337 1.258-.78 1.815-1.338.558-.556 1-.624 1.338-1.814.318-.645.533-1.51.592-2.793.06-1.28.073-1.692.073-4.948s-.014-3.668-.073-4.948c-.06-1.283-.275-2.148-.592-2.793-.337-.69-.78-1.258-1.338-1.814-.557-.557-1.125-1-1.814-1.337-.645-.318-1.51-.533-2.793-.592C15.668.014 15.257 0 12 0zm0 5.838a6.162 6.162 0 016.162 6.162A6.162 6.162 0 0112 18.162a6.162 6.162 0 01-6.162-6.162A6.162 6.162 0 0112 5.838zM3.963 5.338c-.44 0-.798-.358-.798-.798 0-.44.358-.798.798-.798.44 0 .798.358.798.798 0 .44-.358.798-.798.798zM12 7.953A4.046 4.046 0 007.953 12 4.046 4.046 0 0012 16.047 4.046 4.046 0 0016.047 12 4.046 4.046 0 0012 7.953z"/>
            </svg>
            <input
              v-model="form.socialMedia.instagram"
              placeholder="Instagram"
              type="url"
              class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex items-center space-x-2 w-full">

            <svg class="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 4.557a9.8 9.8 0 01-2.828.775A4.934 4.934 0 0023.337 3.1a9.865 9.865 0 01-3.13 1.196 4.925 4.925 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.922 4.922 0 00-.666 2.475 4.917 4.917 0 002.188 4.1 4.904 4.904 0 01-2.228-.616v.06a4.924 4.924 0 003.95 4.83 4.922 4.922 0 01-2.22.085 4.927 4.927 0 004.6 3.42A9.87 9.87 0 010 21.543a13.944 13.944 0 007.548 2.212c9.056 0 14.009-7.513 14.009-14.009 0-.213-.005-.426-.014-.637A9.935 9.935 0 0024 4.557z"/>
            </svg>
            <input
              v-model="form.socialMedia.twitter"
              placeholder="Twitter"
              type="url"
              class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex items-center space-x-2 w-full">

            <svg class="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.26 7h4.48v14H.26V7zm7.88 0h4.29v2h.06c.6-1.14 2.08-2.35 4.28-2.35 4.58 0 5.43 3.01 5.43 6.92V21h-4.48v-6.53c0-1.56-.03-3.56-2.17-3.56-2.17 0-2.5 1.7-2.5 3.45V21H8.14V7z"/>
            </svg>
            <input
              v-model="form.socialMedia.linkedin"
              placeholder="LinkedIn"
              type="url"
              class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex items-center space-x-2 w-full">

            <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.499 6.203a2.97 2.97 0 00-2.093-2.093C19.785 3.5 12 3.5 12 3.5s-7.785 0-9.406.61A2.97 2.97 0 00.501 6.203C0 7.825 0 12 0 12s0 4.175.501 5.797a2.97 2.97 0 002.093 2.093C4.215 20.5 12 20.5 12 20.5s7.785 0 9.406-.61a2.97 2.97 0 002.093-2.093C24 16.175 24 12 24 12s0-4.175-.501-5.797zM9.75 15.337V8.663L15.75 12l-6 3.337z"/>
            </svg>
            <input
              v-model="form.socialMedia.youtube"
              placeholder="YouTube"
              type="url"
              class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  </div>
</template>





