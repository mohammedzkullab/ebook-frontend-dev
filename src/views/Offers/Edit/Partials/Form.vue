<script setup lang="ts">
import FormSection from '@/components/Forms/FormSection.vue';
import InputLabel from '@/components/Forms/InputLabel.vue';
import TextInput from '@/components/Forms/TextInput.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { ref, watch, onMounted } from 'vue';
import HTTP from '@/apis/HTTP.js';
import router from '@/router'
import Multiselect from 'vue-multiselect'
import { useRoute } from 'vue-router'
import Preloader from '@/components/Preloader.vue'

const route = useRoute();
const offerId = route.params.id;
const errors = ref<any>({})
const offer_types = ref(['book', 'package']);
const discountTypes = ref(['Price', 'Percentage']);
const books = ref([]);
const packages = ref([]);
const selectedOfferType = ref('');
const selectedDiscountType = ref('');
const photoInput = ref(null);
const loading = ref(false);
const http = ref(HTTP)
const ErrorMessage = ref('');

const form = ref({
  id: null,
  name: '',
  offer_type: '',
  book_id: '',
  package_id: '',
  discountType: '',
  discount_price: '',
  discount_percentage: '',
  start_date: '',
  end_date: '',
  image: null
});
const loadOffer = async () => {
  loading.value = true;

  const response = await HTTP.action(`offers/${offerId}`).withToken().get();
  const data = response.data.data;
  try {
  form.value = {
    id: data.id,
    name: data.name,
    offer_type: data.offer_type,
    book_id: data.book || '',
    package_id: data.package || '',
    discountType: data.discount_price ? 'Price' : (data.discount_percentage ? 'Percentage' : ''),
    discount_price: data.discount_price,
    discount_percentage: data.discount_percentage,
    start_date: data.start_date,
    end_date: data.end_date,
    image: null,
  };
  photoPreview.value = data.image ? data.image.original_url : null;
  selectedOfferType.value = data.offer_type;
  selectedDiscountType.value = data.discountType;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const submit = async () => {

  loading.value = true;
  ErrorMessage.value = '';

  const formData = new FormData();
  formData.append('_method', 'put');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      if (key === 'book_id' && value?.id) {
        formData.append(key, value.id);
      } else if (key === 'package_id' && value?.id) {
        formData.append(key, value.id);
      } else if (key !== 'book_id' && key !== 'package_id' && value !== null && value !== '') {
        formData.append(key, value);
      }
    }
  });

  // for (const [key, value] of formData.entries()) {
  //   console.log('FormData Entry:', key, ' - ', value);
  // }

  await HTTP.action(`offers/${offerId}`).withToken().post(formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => {
    router.push({ name: 'offers.index' });
  }).catch(err => {

    if (err.response && err.response.data && err.response.data.message) {
      ErrorMessage.value = err.response.data.message;
    }else{
      errors.value = err.response.data.errors
    }
  }).finally(() => loading.value = false);
};

const loadBooks = async (page = null) => {
  try {
    const response = await http.value.action('books').withToken().paginate(page);
    books.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  }
};

const searchActionBook = async (search) => {
  http.value.search(search)

  await loadBooks()
}

const loadPackages = async (page = null) => {
  loading.value = true
  http.value.action('packages').withToken().paginate(page)
    .then(res => {
      packages.value = res.data
    }).catch(err => console.error(err))
    .finally(() => loading.value = false)
};

const searchActionPackage = async (search) => {
  http.value.search(search)

  await loadBooks()
}

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

const photoPreview = ref(form.value.image ? form.value.image : null);

onMounted(()=>{
  loadBooks();
  loadPackages();
  loadOffer();
});
</script>
<template>
  <preloader :loading="loading"/>
  <FormSection @submitted="submit">
    <template #title>Edit Offer</template>
    <template #description>Edit the existing offer details.</template>
    <template #form>
      <div class="col-span-6">
        <InputLabel for="name" value="Offer Name" />
        <TextInput id="name" v-model="form.name" type="text" placeholder="Enter Offer Name" class="mt-1 block w-full" />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>


      <div class="col-span-6">
        <InputLabel for="offer_type" value="Offer Type" />
        <div class="space-x-4">
          <label v-for="type in offer_types" :key="type">
            <input type="radio" v-model="form.offer_type" :value="type" /> {{ type }}
          </label>
          <span v-if="errors.offer_type" class="text-red font-bold text-xs">{{ errors.offer_type?.join() }}</span>
        </div>
      </div>

      <div v-if="form.offer_type === 'book'" class="col-span-6">
        <InputLabel for="books" value="Select Book" />
        <Multiselect
          v-model="form.book_id"
          :options="books"
          :searchable="true"
          label="name"
          track-by="id"
          placeholder="Select books"
          class="mt-1 block w-full"
          @search-change="searchActionBook"
        />
        <span v-if="errors.book_id" class="text-red font-bold text-xs">{{ errors.book_id?.join() }}</span>
      </div>

      <div v-if="form.offer_type === 'package'" class="col-span-6">
        <InputLabel for="packages" value="Select Package" />
        <Multiselect
          v-model="form.package_id"
          :options="packages.data"
          :searchable="true"
          label="name"
          track-by="id"
          placeholder="Select books"
          class="mt-1 block w-full"
          @search-change="searchActionPackage"
        />
        <span v-if="errors.package_id" class="text-red font-bold text-xs">{{ errors.package_id?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="discountType" value="Discount Type" />
        <div class="space-x-4">
          <label v-for="type in discountTypes" :key="type">
            <input type="radio" v-model="form.discountType" :value="type" /> {{ type }}
          </label>
        </div>
      </div>

      <div v-if="form.discountType === 'Percentage'" class="col-span-6">
        <InputLabel for="discount_percentage" value="Discount Percentage" />
        <TextInput id="discount_percentage" v-model="form.discount_percentage" type="number" placeholder="Enter Discount Percentage" class="mt-1 block w-full" />
        <span v-if="errors.discount_percentage" class="text-red font-bold text-xs">{{ errors.discount_percentage?.join() }}</span>
      </div>

      <div v-if="form.discountType === 'Price' && form.offer_type !== 'Packages'" class="col-span-6">
        <InputLabel for="discount_price" value="Discount Price" />
        <TextInput id="discount_price" v-model="form.discount_price" type="number" placeholder="Enter Discount Price" class="mt-1 block w-full" />
        <span v-if="errors.discount_price" class="text-red font-bold text-xs">{{ errors.discount_price?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="start_date" value="Start Date" />
        <TextInput id="start_date" v-model="form.start_date" type="date" class="mt-1 block w-full" />
        <span v-if="errors.start_date" class="text-red font-bold text-xs">{{ errors.start_date?.join() }}</span>
        <p v-if="ErrorMessage" class="text-red font-bold text-xs">{{ ErrorMessage }}</p>
      </div>

      <div class="col-span-6">
        <InputLabel for="end_date" value="End Date" />
        <TextInput id="end_date" v-model="form.end_date" type="date" class="mt-1 block w-full" />
        <span v-if="errors.end_date" class="text-red font-bold text-xs">{{ errors.end_date?.join() }}</span>
        <p v-if="ErrorMessage" class="text-red font-bold text-xs">{{ ErrorMessage }}</p>
      </div>

      <div class="col-span-6">
        <InputLabel for="image" value="Image" />
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
        <PrimaryButton type="submit">Update Offer</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>
