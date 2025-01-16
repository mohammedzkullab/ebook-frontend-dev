<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute} from 'vue-router';
import FormSection from "@/components/Forms/FormSection.vue";
import InputLabel from "@/components/Forms/InputLabel.vue";
import TextInput from "@/components/Forms/TextInput.vue";
import TextArea from "@/components/Forms/TextArea.vue";
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import Preloader from "@/components/Preloader.vue";
import HTTP from '@/apis/HTTP.js';
import router from "@/router/index";
import Multiselect from 'vue-multiselect';

const route = useRoute();
const authorId = route.params.id;
const http = ref(HTTP)
const countries = ref([]);
const loading = ref(false);
const showWarningModal = ref(false);
let initialized = false;


const form = ref({
  name: '',
  country: '',
  phone: '',
  description: '',
  image: null,
  nickname: '',
  has_books:null,
  phone_code:''
});

const errors = ref<any>({})

const loadAuthor = async () => {

  loading.value = true;
  try {

    const res = await HTTP.action(`authors/${authorId}`).withToken().get();
    const data = res.data.author;
    form.value = {
      name: data?.name || '',
      nickname: data?.details?.nickname || '',
      country: data?.country || '',
      phone: data?.phone || '',
      description: data?.details?.description || '',
      has_books: data?.has_books,
      image:null,
    };
    photoPreview.value = data.image ? data.image.original_url : null;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadCountries = async (page = null) => {
  try {
    const response = await http.value.action('countries').withToken().paginate(page)
    countries.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  }
};

const searchAction = async (search) => {
  http.value.search(search)

  await loadCountries()
}

onMounted(() => {
  loadAuthor();
  loadCountries();
});

const photoInput = ref(null);

const updatePhotoPreview = () => {
  const photo = photoInput.value.files[0];

  if (! photo) return;

  form.value.image = photo;

  const reader = new FileReader();

  reader.onload = (e) => {
    photoPreview.value = e.target.result;
  };

  reader.readAsDataURL(photo);
};

const photoPreview = ref(form.value.image ? form.value.image : null);

const submit = async () => {
  if (form.value.has_books) {
    showWarningModal.value = true;
    return;
  }
  
  await confirmUpdate();
};

const closeWarningModal = () => {
  showWarningModal.value = false;
};

const confirmUpdate = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('_method', 'put');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      if (key === 'country' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.id);
      } else {
        formData.append(key, value);
      }
    }
  });

  await HTTP.action(`authors/${authorId}`).withToken().post(formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => {
      router.push({ name: 'Authors.index' });
    })
    .catch(err => {
      errors.value = err.response.data.errors;
    })
    .finally(() => loading.value = false);

  showWarningModal.value = false;
};

watch(
  () => form.value.country,
  (newCountryId) => {
    if (initialized && form.value.phone) {
      const phoneCode = newCountryId ? newCountryId.phone_code : '';
      form.value.phone = phoneCode + form.value.phone.replace(/^\+[0-9]{1,3}/, '');
    }
    initialized = true;
  }
);

const validatePhone = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  const regex = /^\+?[0-9]*$/;

  if (!regex.test(value)) {
    input.value = value.slice(0, -1);
  }

  form.value.phone = input.value;
};
</script>

<template>
   <preloader :loading="loading"/>
  <div>
    <FormSection @submitted="submit">
      <template #title>
        Edit Author
      </template>
      <template #description>
        Update the author details.
      </template>

      <template #form>
        <div class="col-span-6">
          <InputLabel for="name" value="Name" />
          <TextInput
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Author's name"
            class="mt-1 block w-full"
          />
          <p class="text-gray-500 text-xs mt-1">Username must be between 3 and 20 characters.</p>
          <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="nickname" value="Nickname " />
          <TextInput
            id="nickname"
            v-model="form.nickname"
            type="text"
            placeholder="Author's nickname"
            class="mt-1 block w-full"
          />
          <span v-if="errors.nickname" class="text-red font-bold text-xs">{{ errors.nickname?.join() }}</span>
        </div>

        <div class="col-span-6">
        <InputLabel for="country" value="Country" />
        <Multiselect
          v-model="form.country"
          :options="countries"
          :multiple="false"
          :searchable="true"
          label="name"
          track-by="id"
          class="mt-1 block w-full"
          @search-change="searchAction"
        />
        <span v-if="errors.country" class="text-red font-bold text-xs">{{ errors.country?.join()}}</span>
      </div>

      <div class="col-span-6">
      <InputLabel for="phone" value="Phone Number" />
      <TextInput 
      v-model="form.phone" 
      id="phone" 
      type="tel" 
      placeholder="Enter phone number"
      class="mt-1 block w-full" 
      @input="validatePhone"
    />
    <p class="text-gray-500 text-xs mt-1">Phone number must start with + and not exceed 14 digits.</p>
    <span v-if="errors.phone" class="text-red font-bold text-xs">{{ errors.phone?.join() }}</span>
  </div>

        <div class="col-span-6">
          <InputLabel for="description" value="Description " />
          <TextArea
            id="description"
            v-model="form.description"
            rows="4"
            placeholder="Author's description"
            class="mt-1 block w-full"
          />
          <span v-if="errors.description" class="text-red font-bold text-xs">{{ errors.description?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="image" value="Author Image" />
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
          <span v-if="errors.image" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.image" :key="index">
              {{ error }}<br>
            </span>
          </span>
        </div>

        <div v-if="showWarningModal" class="fixed inset-0 flex items-center justify-center dark:bg-[#1a222c] bg-black bg-opacity-50 dark:bg-opacity-50">
          <div class="bg-white rounded-lg shadow-lg p-6 w-1/3 dark:bg-[#1a222c]">
            <h3 class="text-lg font-semibold">Warning!</h3>
            <p class="text-xl font-semibold mb-4 dark:text-white">
              This author has books associated with them. Are you sure you want to proceed with the update?
            </p>
            <div class="flex justify-end mt-4">
              <PrimaryButton @click="closeWarningModal">Cancel</PrimaryButton>
              <PrimaryButton @click="confirmUpdate" class="ml-2" type="button">Proceed</PrimaryButton>
            </div>
          </div>
        </div>

        <div class="col-span-6 mt-4 ml-auto">
          <PrimaryButton type="submit">
            Update
          </PrimaryButton>
        </div>
      </template>
    </FormSection>
  </div>
</template>
