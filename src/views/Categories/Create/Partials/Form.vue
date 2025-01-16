<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router';
import FormSection from '@/components/Forms/FormSection.vue'
import InputLabel from '@/components/Forms/InputLabel.vue'
import TextInput from '@/components/Forms/TextInput.vue'
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import HTTP from '@/apis/HTTP.js'
import router from '@/router'

const loading = ref(false)
const route = useRoute();
const form = ref({
  name: '',
  type: '',
  image:null,
  parent_id: '',
  status: false,
});

const photoInput = ref(null);
const photoPreview = ref(null);

const updatePhotoPreview = () => {
  const photo = photoInput.value.files[0];
  if (photo) {
    form.value.image = photo;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(photo);
  } else {
    form.value.image = null;
    photoPreview.value = null;
  }
};

const errors = ref<any>({});
const mainClassifications = ref([]);

const loadMainClassifications = async (page = null) => {
  HTTP.action('categories').withToken().paginate(page)
    .then(res => mainClassifications.value = res.data).catch(err => console.error(err))
    .finally(() => loading.value = false);
};

onMounted(() => {
  loadMainClassifications();
});


const submit = async () => {
  loading.value = true;

  const formData = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    if (key === 'status') {
      formData.append(key, value ? '1' : '0');
    } else if (value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  await HTTP.action('categories').withToken().post(formData)
    .then(res => {
      router.push({name: 'categories.index'});
    }).catch(err => {
      errors.value = err.response.data.errors
    }).finally(() => loading.value = false);
};
;
</script>

<template>
  <FormSection @submitted="submit">
    <template #title>
      Categories
    </template>
    <template #description>
      Add a new category.
    </template>

    <template #form>

      <div class="col-span-6">
        <InputLabel for="name" value="Name *" />
        <TextInput
          v-model="form.name"
          id="name"
          type="text"
          placeholder="Type Category Name"
          class="mt-1 block w-full"
        />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="parent_id" value="Parent Category" />
        <select
          v-model="form.parent_id"
          id="parent_id"
          class="mt-1 block w-full border border-gray-300 rounded-md p-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <option value="" disabled>Select Parent Category</option>
          <option v-for="(item, index) in mainClassifications.data" :key="index" :value="item.id">
            {{ item.full_path }}
          </option>
        </select>
        <span v-if="errors.parent_id" class="text-red font-bold text-xs">{{ errors.parent_id?.join() }}</span>
      </div>

      <div class="col-span-3 flex items-center">
        <input
          id="status"
          type="checkbox"
          v-model="form.status"
          class="mr-2"
        />
        <InputLabel for="status" value="Display on Home Page" />
        <span v-if="errors.status" class="text-red font-bold text-xs ml-2">
          {{ errors.status?.join() }}
           </span>
      </div>


      <div class="col-span-6">
        <InputLabel for="image" value="Category Image"/>
        <label
          for="image"
          class="z-0 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 relative overflow-hidden"
        >
          <div v-if="!photoPreview" class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">.png, .jpeg (MAX. 2MB)</p>
          </div>


          <img v-if="photoPreview" :src="photoPreview" class="max-h-56 max-w-full object-contain" />

          <input
            id="image"
            accept="image/jpeg,image/png,image/jpg"
            type="file"
            class="hidden"
            ref="photoInput"
            @change="updatePhotoPreview"
          />
        </label>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span class="font-semibold">Hint:</span> Please ensure your image is clear and well-lit for best results. <br>
          Ensure that the image dimensions are between 100x100 and 2000x2000 pixels.
        </p>

      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">
          Submit
        </PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>