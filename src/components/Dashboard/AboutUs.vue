<template>
  <div class="container mx-auto p-8 bg-[#f3f8fd] dark:bg-[#24303f] rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold text-center mb-6">About Us</h1>

    <div class="flex flex-col space-y-4">
      <div class="relative">
        <label for="aboutText" class="block text-lg font-semibold text-gray-700"> Text</label>

        <textarea
          id="aboutText"
          v-model="aboutText"
          rows="10"
          placeholder="Write about us here..."
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
import {quillEditor} from 'vue-quill-editor';
export default {
  props: {
    apiEndpoint: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      aboutText: '',
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
      const formData = new FormData();
      formData.append('aboutText', this.aboutText);


      this.images.forEach((image) => {
        formData.append('images[]', image);
      });

      try {
        const response = await axios.post(this.apiEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Content submitted successfully:', response.data);
        alert('Content submitted successfully!');
        this.resetForm();
      } catch (error) {
        console.error('Error submitting content:', error);
        alert('Error submitting content: ' + error.response?.data?.message || error.message);
      }
    },
    resetForm() {
      this.aboutText = '';
      this.images = [];
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>

