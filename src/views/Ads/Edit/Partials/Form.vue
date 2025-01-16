<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import FormSection from '@/components/Forms/FormSection.vue';
import InputLabel from '@/components/Forms/InputLabel.vue';
import TextInput from '@/components/Forms/TextInput.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import HTTP from '@/apis/HTTP.js';
import router from "@/router/index";
import Preloader from '@/components/Preloader.vue'

const route = useRoute();
const adId = route.params.id;
const errors = ref<any>({})
const loading = ref(false);
const photoInput = ref(null);
const photoInputWeb = ref(null);

const form = ref({
  title: '',
  description: '',
  image_mobile: null,
  image_web: null,
  status: 'active',
  type: 'general'
});

const updatePhotoPreview = () => {
  const photo = photoInput.value.files[0];
  if (photo) {
    form.value.image_mobile = photo;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(photo);
  } else {
    form.value.image_mobile = null;
    photoPreview.value = null;
  }
};

const photoPreview = ref(form.value.image ? form.value.image : null);

const updatePhotoPreviewWeb = () => {
  const photo = photoInputWeb.value.files[0];
  if (photo) {
    form.value.image_web = photo;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreviewWeb.value = e.target?.result as string;
    };
    reader.readAsDataURL(photo);
  } else {
    form.value.image_web = null;
    photoPreviewWeb.value = null;
  }
};

const photoPreviewWeb = ref(form.value.image_web ? form.value.image_web : null);

const loadAd = async () => {
  loading.value = true;
  try {
    const res = await HTTP.action(`ads/${adId}`).withToken().get();
    const data = res.data.data;
    if (data) {
      form.value = {
        title: data.title || '',
        status: data.status || '',
        description: data.description || '',
        type: data.type || '',
        image_mobile: null,
        image_web: null,
      };
      photoPreview.value = data.image ? data.image.original_url : null;
      photoPreviewWeb.value = data.image_web ? data.image_web.original_url : null;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const submit = async () => {

  loading.value = true;

  const formData = new FormData();
  formData.append('_method', 'put');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  await HTTP.action(`ads/${adId}`).withToken().post(formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => {
    router.push({ name: 'Ads.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
  }).finally(() => loading.value = false);
};

onMounted(() => {
  loadAd();
});

</script>

<template>
  <preloader :loading="loading"/>
    <FormSection @submitted="submit">
      <template #title> Edit Ad </template>
      <template #description> Update the Ad details. </template>
      <template #form>
        <div class="col-span-6">
          <InputLabel for="title" value="Title" />
          <TextInput
            id="title"
            type="text"
            placeholder="Type Ad Title"
            v-model="form.title"
            class="mt-1 block w-full"
          />
          <span v-if="errors.title" class="text-red font-bold text-xs">{{ errors.title?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="type" value="Ad Type" />
          <select v-model="form.type" id="adType" class="mt-1 block w-full border border-gray-300 rounded-md px-1 py-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <option value="general">General</option>
            <option value="publishing house">Publishing House</option>
            <option value="authors">Authors</option>
          </select>
          <span v-if="errors.type" class="text-red font-bold text-xs">{{ errors.type?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="description" value="Description" />
          <textarea id="description" v-model="form.description" placeholder="Enter a description" class="mt-1 block w-full border border-gray-300 rounded-md px-1.5 py-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"></textarea>
          <span v-if="errors.description" class="text-red font-bold text-xs">{{ errors.description?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="status" value="Status" />
          <select v-model="form.status" id="status" class="mt-1 block w-full border border-gray-300 rounded-md px-1 py-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span v-if="errors.status" class="text-red font-bold text-xs">{{ errors.status?.join() }}</span>
        </div>

        <div class="col-span-6">
            <InputLabel for="image_mobile" value="Mobile Image" />
            <label
              for="image_mobile"
              class="z-0 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 relative overflow-hidden"
            >
              <div v-if="!photoPreview" class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">.png, .jpeg (MAX. 10MB)</p>
              </div>

              <img v-if="photoPreview" :src="photoPreview" class="max-h-56 max-w-full object-contain" />

              <input
                id="image_mobile"
                accept="image/jpeg,image/png,image/jpg"
                type="file"
                class="hidden"
                ref="photoInput"
                @change="updatePhotoPreview"
              />
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span class="font-semibold">Hint:</span> Please ensure your image is clear and well-lit for best results. <br>
            </p>
          <span v-if="errors.image_mobile" class="text-red font-bold text-xs">
          <span v-for="(error, index) in errors.image_mobile" :key="index">
            {{ error }}<br>
          </span>
        </span>
        </div>

        <div class="col-span-6">
          <InputLabel for="image_web" value="Website Image" />
          <label
            for="image_web"
            class="z-0 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 relative overflow-hidden"
          >
            <div v-if="!photoPreviewWeb" class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">.png, .jpeg (MAX. 10MB)</p>
            </div>

            <img v-if="photoPreviewWeb" :src="photoPreviewWeb" class="max-h-56 max-w-full object-contain" />

            <input
              id="image_web"
              accept="image/jpeg,image/png,image/jpg"
              type="file"
              class="hidden"
              ref="photoInputWeb"
              @change="updatePhotoPreviewWeb"
            />
          </label>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span class="font-semibold">Hint:</span> Please ensure your image is clear and well-lit for best results. <br>
          </p>
          <span v-if="errors.image_web" class="text-red font-bold text-xs">
          <span v-for="(error, index) in errors.image_web" :key="index">
            {{ error }}<br>
          </span>
        </span>
        </div>

        <div class="col-span-6 mt-4 ml-auto">
          <PrimaryButton type="submit" >
            Update
          </PrimaryButton>

        </div>
      </template>
    </FormSection>
</template>