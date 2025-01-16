<script setup lang="ts">
import router from "@/router/index";
import FormSection from "@/components/Forms/FormSection.vue";
import InputLabel from "@/components/Forms/InputLabel.vue";
import TextInput from "@/components/Forms/TextInput.vue";
import TextArea from "@/components/Forms/TextArea.vue";
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import HTTP from '@/apis/HTTP.js'
import Multiselect from 'vue-multiselect';
import { onMounted, ref, watch } from 'vue'

const countries = ref([])
const loading = ref(false)
const http = ref(HTTP)

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
  await loadCountries();
}

onMounted(() => {
  loadCountries();
});

const form = ref({
  name: '',
  email: '',
  country_id: '',
  phone_code:'',
  phone: '',
  image: null ,
  description: '',

});

const errors = ref<any>({})
const photoInput = ref(null);
const photoPreview = ref(null);

const updatePhotoPreview = () => {
  const photo = photoInput.value?.files?.[0];
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

watch(() => form.value.country_id, () => {
  form.value.phone = form.value.country_id ? form.value.country_id.phone_code : '';
});

const submit = async () => {

  loading.value = true;

  const formData = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      if (key === 'country_id' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.id);
      } else {
        formData.append(key, value);
      }
    }
  });

  await HTTP.action('houses').withToken().post(formData).then(res => {
    router.push({ name: 'Publishers.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
  }).finally(() => loading.value = false);
};

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
  <div>
    <FormSection @submitted="submit">
      <template #title>
        Publishing House
      </template>
      <template #description>
        Add a new publishing house
      </template>
      <template #form>
        <div class="col-span-6">
          <InputLabel for="name" value="Name" />
          <TextInput
          v-model="form.name"
            id="name"
            type="text"
            placeholder="Type Publisher House Name"
            class="mt-1 block w-full"
          />
          <p class="text-gray-500 text-xs mt-1">Name must be between 3 and 20 characters.</p>
          <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
        </div>
       
        <div class="col-span-6">
          <InputLabel for="email" value="Email " />
          <TextInput
          v-model="form.email"
            id="email"
            type="text"
            placeholder="Type Publisher House Email"
            class="mt-1 block w-full"
          />
          <p class="text-gray-500 text-xs mt-1">Email should be in a valid format (e.g., user@example.com).</p>
          <span v-if="errors.email" class="text-red font-bold text-xs">{{ errors.email?.join() }}</span>
        </div>

        <div class="col-span-6">
        <InputLabel for="country_id" value="Country" />
        <Multiselect
          v-model="form.country_id"
          :options="countries"
          :multiple="false"
          :searchable="true"
          label="name"
          track-by="id"
          class="mt-1 block w-full"
          @search-change="searchAction"
        />
        <span v-if="errors.country_id" class="text-red font-bold text-xs">{{ errors.country_id?.join()}}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="phone" value="Phone Number" />
        <TextInput v-model="form.phone" id="phone" type="tel"
        inputmode="numeric"
        placeholder="Enter phone number"
        class="mt-1 block w-full" 
         @input="validatePhone"
        />
        
        <p class="text-gray-500 text-xs mt-1">Phone number must start with + and not exceed 14 digits.</p>
        <span v-if="errors.phone" class="text-red font-bold text-xs">{{ errors.phone?.join() }}</span>
      </div>

        <div class="col-span-6">
          <InputLabel for="description" value="Description" />
          <TextArea
          v-model="form.description"
            id="description"
            placeholder="Type Description"
            class="mt-1 block w-full"
          />
          <span v-if="errors.description" class="text-red font-bold text-xs">{{ errors.description?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="image" value="Publish House Image" />
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

          <div class="col-span-6 mt-4 ml-auto">
            <PrimaryButton type="submit" >
              Submit
            </PrimaryButton>
          </div>

      </template>
    </FormSection>
  </div>
</template>