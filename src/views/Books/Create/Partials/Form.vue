<script setup lang="ts">
import FormSection from '@/components/Forms/FormSection.vue'
import InputLabel from '@/components/Forms/InputLabel.vue'
import TextInput from '@/components/Forms/TextInput.vue'
import TextArea from '@/components/Forms/TextArea.vue'
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import { onMounted, ref } from 'vue'
import HTTP from '@/apis/HTTP.js'
import router from "@/router/index";
import Multiselect from 'vue-multiselect';
import Preloader from '@/components/Preloader.vue'

const errors = ref<any>({})
const authors = ref([]);
const loading = ref(false);
const houses = ref([]);
const countries = ref([]);
const categories = ref([]);
const books = ref([]);
const keywords = ref([]);
const http = ref(HTTP)

const loadAuthors = async (page = null) => {
  try {
    const response = await http.value.action('authors').withToken().paginate(page)
    authors.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  }
};

const loadHouses = async (page = null) => {
  try {
    const response = await http.value.action('houses').withToken().paginate(page)
    houses.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
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
  await loadCountries();
};

const searchActionAuthor = async (search) => {
  http.value.search(search)
  await loadAuthors();
};

const searchActionHouse = async (search) => {
  http.value.search(search)
  await loadHouses();
};

const searchActionCategory = async (search) => {
  http.value.search(search)
  await loadCategory();
};

const searchActionBook = async (search) => {
  http.value.search(search)
  await loadBooks();
};

const searchActionKeyword = async (search) => {
  http.value.search(search)
  await loadKeywords();
};

const loadCategory = async (page = null) => {
  try {
    const response = await HTTP.action('categories').withToken().paginate(page);
    categories.value = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadBooks = async (page = null) => {
  try {
    const response = await HTTP.action('books').withToken().paginate(page);
    books.value = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadKeywords = async (page = null) => {
  try {
    const response = await HTTP.action('keywords').withToken().paginate(page);
    keywords.value = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  loadAuthors();
  loadHouses();
  loadCountries();
  loadCategory();
  loadBooks();
  loadKeywords();
});

const form = ref({
  name: '',
  author_id: '',
  country_id: '',
  house_id: '',
  sku: '',
  isbn: '',
  price: '',
  pages: '',
  free_reading_percentage: '',
  category_id: [],
  explanation: '',
  description: '',
  keywords: '',
  applicable_tax: true,
  main_image: null,
  review_images: [],
  link: '',
  related_book_id: [],
  file: null,
  file_free:null,
  status: true,
  keyword_id: []
});
const photoInput = ref(null);
const photoPreviews = ref<string[]>([]);

const updatePhotoPreview = () => {
  const files = photoInput.value?.files;
  if (files && files.length > 0) {
    form.value.review_images = [];
    photoPreviews.value = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        form.value.review_images.push(file);
        photoPreviews.value.push(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    });
  } else {
    form.value.review_images = [];
    photoPreviews.value = [];
  }
};

const photoInputMain = ref(null);
const photoPreviewsMain = ref(null);

const updatePhotoPreviewMian = () => {
  const photo = photoInputMain.value?.files?.[0];
  if (photo) {
    form.value.main_image = photo;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreviewsMain.value = e.target?.result as string;
    };
    reader.readAsDataURL(photo);
  } else {
    form.value.main_image = null;
    photoPreviewsMain.value = null;
  }
};
const handleFileInput = (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip')) {
    form.value.file = file;
    errors.value.file = null;
  } else {
    errors.value.bfile = ['Please upload a valid file (PDF or EPUB).'];
  }
};

const handleFileInputFree = (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip')) {
    form.value.file_free = file;
    errors.value.file = null;
  } else {
    errors.value.bfile = ['Please upload a valid file (PDF or EPUB).'];
  }
};
const submit = async () => {

  loading.value = true;
  errors.value = {};
  const formData = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      if (key === 'applicable_tax') {
        formData.append(key, value ? 1 : 0);
      } else if (key === 'status') {
        formData.append(key, value == true ? 1 : 0);
      } else if (key === 'review_images' && Array.isArray(value)) {
        value.forEach((image, index) => formData.append(`review_images[${index}]`, image));
      } else if (key === 'country_id' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.id);
      }
      else if (key === 'house_id' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.id);
      } else if (key === 'author_id' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.id);
      } else if (key === 'category_id' && Array.isArray(value)) {
        value.forEach((category, index) => {
          if (typeof category === 'object' && 'id' in category) {
            formData.append(`category_id[${index}]`, category.id);
          }
        });
      }else if (key === 'related_book_id' && Array.isArray(value)) {
        value.forEach((book, index) => {
          if (typeof book === 'object' && 'id' in book) {
            formData.append(`related_book_id[${index}]`, book.id);
          }
        });
      }else if(key === 'keyword_id' && Array.isArray(value)){
        value.forEach((keyword, index) => {
          if (typeof keyword === 'object' && 'id' in keyword) {
            formData.append(`keyword_id[${index}]`, keyword.id);
          }
        });
      }else if (key === 'file') {
        formData.append(key, value);
      }else if (key === 'file_free') {
        formData.append(key, value);
      }
      else {
        formData.append(key, value);
      }
    }
  });

  try {
    await HTTP.action(`books`).withToken().post(formData);
    router.push({ name: 'books.index' });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      console.error('Error Response:', err.response.data.errors);
      errors.value = err.response.data.errors;
    } else {
      console.error('Unexpected Error:', err);
      errors.value.general = ['The uploaded file is too large.'];
    }
  } finally {
    loading.value = false;
  }
};

</script>

<template>
    <preloader :loading="loading"/>
    <FormSection @submitted="submit">
      <template #title> Book </template>
      <template #description> Add a new book. </template>
      <template #form>
        <div class="col-span-6">
          <InputLabel for="name" value="Name" />
          <TextInput id="name" v-model="form.name" type="text" placeholder="Type Book Name" class="mt-1 block w-full" />
          <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
        </div>

        <div class="col-span-3">
          <InputLabel for="author_id" value="Author" />
          <Multiselect
            v-model="form.author_id"
            :options="authors"
            :multiple="false"
            :searchable="true"
            label="name"
            track-by="id"
            class="mt-1 block w-full"
            @search-change="searchActionAuthor"
          />
          <span v-if="errors.author_id" class="text-red font-bold text-xs">{{ errors.author_id?.join()}}</span>
        </div>

        <div class="col-span-3">
          <InputLabel for="house_id" value="Publishing House" />
          <Multiselect
            v-model="form.house_id"
            :options="houses"
            :multiple="false"
            :searchable="true"
            label="name"
            track-by="id"
            @search-change="searchActionHouse"
            class="mt-1 block w-full"
          />
          <span v-if="errors.house_id" class="text-red font-bold text-xs">{{ errors.house_id?.join()}}</span>
        </div>

        <div class="col-span-3">
          <InputLabel for="sku" value="SKU" />
          <TextInput id="sku" v-model="form.sku" type="text" placeholder="Type unique SKU" class="mt-1 block w-full" />
          <span v-if="errors.sku" class="text-red font-bold text-xs">{{ errors.sku?.join() }}</span>
        </div>

        <div class="col-span-3">
          <InputLabel for="isbn" value="ISBN" />
          <TextInput id="isbn" v-model="form.isbn" type="text" placeholder="Type unique ISBN" class="mt-1 block w-full" />
          <span v-if="errors.isbn" class="text-red font-bold text-xs">{{ errors.isbn?.join() }}</span>
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

        <div class="col-span-2">
          <InputLabel for="price" value="Price" />
          <TextInput id="price" v-model="form.price" type="number" placeholder="Price" class="mt-1 block w-full" />
          <span v-if="errors.price" class="text-red font-bold text-xs">{{ errors.price?.join() }}</span>
        </div>

        <div class="col-span-2">
          <InputLabel for="pages" value="Pages" />
          <TextInput id="pages" v-model="form.pages" type="number" placeholder="Pages" class="mt-1 block w-full" />
          <span v-if="errors.pages" class="text-red font-bold text-xs">{{ errors.pages?.join() }}</span>
        </div>

        <div class="col-span-2">
          <InputLabel for="free_reading_percentage" value="Free Reading Percentage" />
          <TextInput
            id="free_reading_percentage"
            v-model="form.free_reading_percentage"
            type="number"
            placeholder="Free Reading Percentage"
            class="mt-1 block w-full"
          />
          <span v-if="errors.free_reading_percentage" class="text-red font-bold text-xs">{{ errors.free_reading_percentage?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="category_id" value="Category" />
          <Multiselect
            v-model="form.category_id"
            :options="categories"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="id"
            placeholder="Select Categories"
            class="mt-1 block w-full"
            @search-change="searchActionCategory"
            :close-on-select="false"
          />
          <span v-if="errors.category_id" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.category_id" :key="index">
              {{ error }}<br>
            </span>
          </span>
        </div>

        <div class="col-span-6">
          <InputLabel for="description" value="Description" />
          <TextArea id="description" v-model="form.description" placeholder="Type Description" class="mt-1 block w-full" />
          <span v-if="errors.description" class="text-red font-bold text-xs">{{ errors.description?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="explanation" value="Explanation" />
          <TextArea id="explanation" v-model="form.explanation" placeholder="Type Explanation" class="mt-1 block w-full" />
          <span v-if="errors.explanation" class="text-red font-bold text-xs">{{ errors.explanation?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="keywords" value="Keywords" />
          <Multiselect
            v-model="form.keyword_id"
            :options="keywords"
            :multiple="true"
            :searchable="true"
            label="keyword"
            track-by="id"
            placeholder="Select Keywords"
            class="mt-1 block w-full"
            @search-change="searchActionKeyword"
            :close-on-select="false"
          />
          <span v-if="errors.keyword_id" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.keyword_id" :key="index">
              {{ error }}<br>
            </span>
          </span>
        </div>

        <div class="col-span-6">
          <InputLabel for="related_book_id" value="Related Books" />
          <Multiselect
            v-model="form.related_book_id"
            :options="books"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="id"
            placeholder="Select Books"
            class="mt-1 block w-full"
            @search-change="searchActionBook"
            :close-on-select="false"
          />
          <span v-if="errors.related_book_id" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.related_book_id" :key="index">
              {{ error }}<br>
            </span>
          </span>
        </div>


        <div class="col-span-6">
          <InputLabel for="status" value="Book Status" />
          <select
            v-model="form.status"
            id="status"
            class="mt-1 block w-full border border-gray-300 rounded-md px-1 py-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <option disabled value="">Select status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <span v-if="errors.status" class="text-red font-bold text-xs">{{ errors.status?.join() }}</span>
        </div>


        <div class="col-span-6">
          <InputLabel for="link" value="Link" />
          <TextInput
            id="link"
            type="text"
            placeholder="Link"
            v-model="form.link"
            class="mt-1 block w-full"
          />
          <span v-if="errors.link" class="text-red font-bold text-xs">{{ errors.link?.join() }}</span>
        </div>

        <div class="col-span-6">
          <label class="flex items-center">
            <input type="checkbox" v-model="form.applicable_tax" class="mr-2" checked /> Applicable Tax
          </label>
          <span v-if="errors.applicable_tax" class="text-red font-bold text-xs">{{ errors.applicable_tax?.join() }}</span>

        </div>

        <div class="col-span-3">
          <InputLabel for="file" value="Book File (PDF/EPUB)" />
          <input
            id="file"
            type="file"
            accept=".pdf,.epub"
            @change="handleFileInput"
            class="mt-1 block w-full dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
          <span v-if="errors.file" class="text-red font-bold text-xs">
            {{ errors.file?.join() }}
          </span>
          <span v-if="errors.general" class="text-red font-bold text-xs">
            {{ errors.general?.join() }}
          </span>
        </div>

        <div class="col-span-3">
          <InputLabel for="file_free" value="Free File (PDF/EPUB)" />
          <input
            id="file_free"
            type="file"
            accept=".pdf,.epub"
            @change="handleFileInputFree"
            class="mt-1 block w-full dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
          <span v-if="errors.file_free" class="text-red font-bold text-xs">{{ errors.file_free?.join() }}</span>
        </div>

        <div class="col-span-6">
          <InputLabel for="main_image" value="Book Image" />
          <label
            for="main_image"
            class="z-0 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 relative overflow-hidden"
          >
            <div v-if="!photoPreviewsMain" class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">.png, .jpeg (MAX. 2MB)</p>
            </div>

            <img v-if="photoPreviewsMain" :src="photoPreviewsMain" class="max-h-56 max-w-full object-contain" />

            <input
              id="main_image"
              accept="image/jpeg,image/png,image/jpg"
              type="file"
              class="hidden"
              ref="photoInputMain"
              @change="updatePhotoPreviewMian"
            />
          </label>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span class="font-semibold">Hint:</span> Please ensure your main image is clear and well-lit for best results. <br />
            Ensure that the main image dimensions are between 100x100 and 2000x2000 pixels.
          </p>
          <span v-if="errors.main_image" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.main_image" :key="index">
              {{ error }}<br>
            </span>
          </span>
        </div>

        <div class="col-span-6">
          <InputLabel for="review_images" value="Review Images" />
          <label
            for="review_images"
            class="z-0 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div v-if="!photoPreviews.length" class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">.png, .jpeg (MAX. 2MB)</p>
            </div>


            <div
              class="mt-2 flex space-x-4 overflow-x-auto max-w-full"
            >
              <img v-for="(preview, index) in photoPreviews" :key="index" :src="preview" class="h-32 w-32 object-cover rounded" />
            </div>

            <input
              id="review_images"
              accept="image/jpeg,image/png,image/jpg"
              type="file"
              class="hidden"
              ref="photoInput"
              @change="updatePhotoPreview"
              multiple
            />
          </label>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span class="font-semibold">Hint:</span> Please ensure your review images are clear and well-lit for best results. <br />
            Ensure that the review images dimensions are between 100x100 and 2000x2000 pixels.
          </p>
          <span v-if="errors.review_images" class="text-red font-bold text-xs">
            <span v-for="(error, index) in errors.review_images" :key="index">
              {{ error }}<br>
            </span>
          </span>
        </div>

        <div class="col-span-6 mt-4 ml-auto">
          <PrimaryButton type="submit" :disabled="loading.value">
            Submit
          </PrimaryButton>
        </div>

      </template>
    </FormSection>
</template>


