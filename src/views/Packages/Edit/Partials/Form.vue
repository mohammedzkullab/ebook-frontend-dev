<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FormSection from "@/components/Forms/FormSection.vue";
import InputLabel from "@/components/Forms/InputLabel.vue";
import TextInput from "@/components/Forms/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import HTTP from '@/apis/HTTP.js';
import router from '@/router'
import Multiselect from 'vue-multiselect'
import { useRoute } from 'vue-router'
import Preloader from '@/components/Preloader.vue'

const errors = ref<any>({})
const books = ref([]);

const loading = ref(false);

const form = ref({
  name: '',
  selectedBook: [],
});

const route = useRoute();
const packageId = route.params.id;
const http = ref(HTTP)

const loadBooks = async (page = null) => {
  try {
    const response = await http.value.action('books').withToken().paginate(page);
    books.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  }
};

const searchAction = async (search) => {
  http.value.search(search)

  await loadBooks()
}

const loadPackage = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action(`packages/${packageId}`).withToken().get();
    const packageData = response.data;
    form.value.name = packageData.data.name;
    form.value.selectedBook = packageData.data.books;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const submit = async () => {

  loading.value = true;

  await HTTP.action(`packages/${packageId}`).withToken().put({
    name: form.value.name,
    book_ids: form.value.selectedBook.map(book => book.id),
  }).then(res => {

    router.push({ name: 'packages.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
    const errorData = err.response.data.errors || {};

    errors.value.book_ids = Object.keys(errorData)
      .filter(key => key.startsWith('book_ids'))
      .flatMap(key => errorData[key]);
    Object.assign(errors.value, errorData);

    console.log(errorData)
  }).finally(() => loading.value = false);
};

onMounted(() => {
  loadBooks();
  loadPackage();
});

</script>

<template>
  <preloader :loading="loading"/>
  <FormSection @submitted="submit">
    <template #title>Edit Package</template>
    <template #description>Edit the details of the package.</template>

    <template #form>

      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput id="name" v-model="form.name" type="text" placeholder="Enter Package Name" class="mt-1 block w-full" />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="selectedBook" value="Select Book" />
        <Multiselect
          v-model="form.selectedBook"
          :options="books"
          :multiple="true"
          :searchable="true"
          label="name"
          track-by="id"
          placeholder="Select books"
          class="mt-1 block w-full"
          @search-change="searchAction"
        />
        <span v-if="errors.book_ids && errors.book_ids.length" class="text-red font-bold text-xs">
          <span v-for="(error, index) in errors.book_ids" :key="index">
            {{ error }}<br>
          </span>
        </span>
      </div>


      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Update Package</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>
