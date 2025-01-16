<template>
  <div class="container mx-auto p-8 bg-[#f3f8fd] dark:bg-[#24303f] rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold text-center mb-6">Terms Of Use</h1>

    <div class="flex flex-col space-y-4">
      <div class="relative">
        <label for="TermsText" class="block text-lg font-semibold text-gray-700"> Text</label>
        <textarea
          id="TermsText"
          v-model="TermsText"
          rows="10"
          placeholder="Write Terms Of Us here..."
          class="mt-2 w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <div class="relative">
        <label for="imageUpload" class="block text-lg font-semibold text-gray-700">Attach Images</label>
        <input
          type="file"
          @change="onFileChange"
          multiple
          class="mt-2 block w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <p class="text-sm text-gray-500">You can attach multiple images to the content.</p>
      </div>

      <div class="flex justify-between items-center">
        <button @click="submitContent" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Submit</button>
      </div>
    </div>

    <div v-if="images.length" class="mt-6">
      <h2 class="text-2xl font-semibold mb-4">Attached Images</h2>
      <div class="grid grid-cols-3 gap-4">
        <img v-for="(image, index) in images" :key="index" :src="image" alt="Attached Image" class="w-full h-auto rounded-lg object-cover" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      TermsText: '',
      images: [],
    };
  },
  methods: {
    onFileChange(event) {
      const files = event.target.files;
      this.images = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    },
    async submitContent() {
      try {

        const formData = new FormData();
        formData.append('termsText', this.TermsText);


        for (let i = 0; i < this.images.length; i++) {
          formData.append(`images[${i}]`, this.images[i]);
        }


        const response = await axios.post(this.apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('API Response:', response.data);
        alert('Content submitted successfully!');

        this.TermsText = '';
        this.images = [];
      } catch (error) {
        console.error('Error submitting the content:', error);
        alert('Failed to submit content. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
