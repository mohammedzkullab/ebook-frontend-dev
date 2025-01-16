<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FormSection from "@/components/Forms/FormSection.vue";
import InputLabel from "@/components/Forms/InputLabel.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import HTTP from '@/apis/HTTP.js'
import Preloader from '@/components/Preloader.vue'
import Editor from '@tinymce/tinymce-vue'

const loading = ref(false);
const errors = ref<any>({})
const photoInput = ref(null);
const photoPreview = ref([]);

const form = ref({
  description: '',
  images: []
});

const fetchPrivacySetting = async () => {
  loading.value = true;

  try {
    const res = await HTTP.action('settings/5').withToken().get();
    const data = res.data.data;
    form.value = {
      description: data.description,
      images: [],
    };
    photoPreview.value = data.images && Array.isArray(data.images)
      ? data.images.map(image => image.original_url)
      : [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const updatePhotoPreview = () => {
  const files = photoInput.value?.files;
  if (files && files.length > 0) {
    form.value.images = [];
    photoPreview.value = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        form.value.images.push(file);
        photoPreview.value.push(e.target?.result as string);
      };

      reader.readAsDataURL(file); // Read the file
    });
  } else {
    form.value.images = [];
    photoPreview.value = [];
  }
};

const submit = async () => {

  const formData = new FormData();
  formData.append('group', 'privacy');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image, index) => formData.append(`images[${index}]`, image));
      } else {
        formData.append(key, value);
      }
    }
  });

  try {
    await HTTP.action('settings').withToken().post(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    window.location.reload();
  } catch (err) {
    errors.value = err.response?.data?.errors || 'An unexpected error occurred.';
  }
};

onMounted(() => {
  fetchPrivacySetting();
});

</script>

<template>
  <preloader :loading="loading"/>
  <FormSection @submitted="submit">
    <template #title>
      Privacy
    </template>
    <template #description>
      Add a Privacy.
    </template>
    <template #form>

      <div class="col-span-6">

        <Editor
          v-model="form.description"
          api-key="trjesuznxum0g23xl69mf4az74a9hpaf4ujby7bw1y4lov2j"
          :init="{
        toolbar_mode: 'sliding',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
      }"
        />

      </div>

      <div class="col-span-6">
        <InputLabel for="images" value="Images" />
        <label
          for="images"
          class="z-0 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 relative overflow-hidden"
        >
          <div v-if="photoPreview.length === 0" class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">.png, .jpeg (MAX. 2MB)</p>
          </div>

          <div v-if="photoPreview.length > 0" class="mt-2 flex space-x-4 overflow-x-auto max-w-full">
            <img v-for="(preview, index) in photoPreview" :key="index" :src="preview" class="max-h-56 max-w-full object-contain" />
          </div>

          <input id="images"
                 accept="image/jpeg,image/png,image/jpg"
                 type="file"
                 class="hidden"
                 ref="photoInput"
                 @input="form.images = $event.target.files[0]"
                 @change="updatePhotoPreview"
                 multiple/>
        </label>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span class="font-semibold">Hint:</span> Please ensure your images are clear and well-lit for best results. <br />
          Ensure that the image dimensions are between 100x100 and 2000x2000 pixels.
        </p>
        <span v-if="errors.images" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.images" :key="index">
              {{ error }}<br>
            </span>
          </span>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>