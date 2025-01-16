<script setup lang="ts">
import FormSection from '@/components/Forms/FormSection.vue'
import InputLabel from '@/components/Forms/InputLabel.vue'
import TextInput from '@/components/Forms/TextInput.vue'
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import { onMounted, ref, watch } from 'vue'
import HTTP from '@/apis/HTTP.js'
import Multiselect from 'vue-multiselect'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import router from '@/router'
import SwitchFour from "@/components/Forms/Switchers/SwitchFour.vue";
import SwitchTwo from "@/components/Forms/Switchers/SwitchTwo.vue";

const errors = ref<any>({})
const loading = ref(false);
const users = ref([]);
const books = ref([]);
const packages = ref([]);
const selectTypes = ref(['Books', 'Packages']);
const types = ref(['P', 'F']);
const typeCode = ref('');
const selectType = ref('');
const http = ref(HTTP)

const form = ref({
  name: '',
  type: '',
  code: '',
  code_length: '',
  ended_at: '',
  book_ids: [],
  package_ids: [],
  uses_total: '',
  discount: '',
  user_ids: [],
  is_applicable_for_all_users: 0,
});

const submit = async () => {

loading.value = true;

const formData = new FormData();
Object.entries(form.value).forEach(([key, value]) => {
  if (value !== null && value !== '') {
    if (key === 'book_ids' && Array.isArray(value)) {
      value.forEach((book, index) => {
        if (book?.id) {
          formData.append(`${key}[${index}]`, book.id);
        }
      });
    } else if (key === 'package_ids' && Array.isArray(value)) {
      value.forEach((package_id, index) => {
        if (package_id?.id) {
          formData.append(`${key}[${index}]`, package_id.id);
        }
      });
    } else if (key === 'user_ids' && Array.isArray(value)) {
      value.forEach((user, index) => {
        if (user?.id) {
          formData.append(`${key}[${index}]`, user.id);
        }
      });
    }  else if (key !== 'book_ids' && key !== 'package_ids' && key !== 'user_ids' && value !== '') {
      formData.append(key, value);
    }
  }
});

await HTTP.action('coupons').withToken().post(formData).then(res => {
  router.push({ name: 'codes.index' });
}).catch(err => {
  errors.value = err.response.data.errors
}).finally(() => loading.value = false);
};

watch(typeCode, (newVal) => {
  if (newVal === 'P') {
    form.value.code_length = '';
    form.value.type = 'P'
  } else if (newVal === 'F') {
    form.value.code = '';
    form.value.type = 'F'
  }
});

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

const loadPackages = async () => {
  try {
    const response = await http.value.action('packages').withToken().get();
    packages.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  }
};

const searchActionPackage = async (search) => {
  http.value.search(search)

  await loadPackages()
}

const loadUsers = async () => {
  try {
    const response = await http.value.action('users').withToken().get();
    users.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  }
};

const searchActionUser = async (search) => {
  http.value.search(search)

  await loadPackages()
}

watch(selectType, (newVal) => {
  if (newVal === 'Books') {
    form.value.package_ids = ''
    loadBooks();
  } else if (newVal === 'Packages') {
    form.value.book_ids = ''
    loadPackages();
  }
});

onMounted(() => {
  loadBooks();
  loadUsers();
});

</script>

<template>
  <FormSection @submitted="submit">
    <template #title>Coupons</template>
    <template #description>Create a new Coupon.</template>
    <template #form>

      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput id="name" v-model="form.name" type="text" placeholder="Enter code name" class="mt-1 block w-full" />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="type" value="Type" />
        <div class="space-x-4">
          <label v-for="type in types" :key="type">
            <input type="radio" v-model="typeCode" :value="type" />  {{ type === 'F' ? 'Automatic' : 'Manual' }}

          </label>
        </div>
        <span v-if="errors.type" class="text-red font-bold text-xs">{{ errors.type?.join() }}</span>
      </div>

      <div v-if="typeCode === 'P'" class="col-span-6">
        <InputLabel for="manualCode" value="Manual Code" />
        <TextInput id="manualCode" v-model="form.code" type="text" placeholder="Enter manual code" class="mt-1 block w-full" />
        <span v-if="errors.code" class="text-red font-bold text-xs">{{ errors.code?.join() }}</span>
      </div>


      <div v-if="typeCode === 'F'" class="col-span-6">
        <InputLabel for="autoCodeCount" value="Number of Codes" />
        <TextInput id="autoCodeCount" max="6" min="1" v-model="form.code_length" type="number" placeholder="Enter number of codes" class="mt-1 block w-full" />
        <span v-if="errors.code_length" class="text-red font-bold text-xs">{{ errors.code_length?.join() }}</span>
        <span class="font-bold text-xs">Max 6 and Min 1</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="selectType" value="Select" />
        <div class="space-x-4">
          <label v-for="type in selectTypes" :key="type">
            <input type="radio" v-model="selectType" :value="type" /> {{ type }}
          </label>
        </div>
      </div>

      <div v-if="selectType === 'Books'" class="col-span-6">
        <InputLabel for="books" value="Select One Book" />
        <Multiselect
          v-model="form.book_ids"
          :options="books"
          :searchable="true"
          :multiple="true"
          label="name"
          track-by="id"
          placeholder="Select One Book"
          class="mt-1 block w-full"
          @search-change="searchActionBook"
        />
        <span v-if="errors.book_ids" class="text-red font-bold text-xs">{{ errors.book_ids?.join() }}</span>
      </div>

      <div v-if="selectType === 'Packages'" class="col-span-6">
        <InputLabel for="packages" value="Select Package" />
        <Multiselect
          v-model="form.package_ids"
          :options="packages"
          :searchable="true"
          :multiple="true"
          label="name"
          track-by="id"
          placeholder="Select One Package"
          class="mt-1 block w-full"
          @search-change="searchActionPackage"
        />
        <span v-if="errors.package_ids" class="text-red font-bold text-xs">{{ errors.package_ids?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="ended_at" value="Expiry Date" />
        <TextInput id="ended_at" v-model="form.ended_at" type="date" class="mt-1 block w-full" />
        <span v-if="errors.ended_at" class="text-red font-bold text-xs">{{ errors.ended_at?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="uses_total" value="Usage Count" />
        <TextInput id="uses_total" v-model="form.uses_total" type="number" placeholder="Enter number of usages" class="mt-1 block w-full" />
        <span v-if="errors.uses_total" class="text-red font-bold text-xs">{{ errors.uses_total?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="discount" value="Discount Percentage" />
        <TextInput id="discount" v-model="form.discount" type="number" placeholder="Enter discount percentage" class="mt-1 block w-full" />
        <span v-if="errors.discount" class="text-red font-bold text-xs">{{ errors.discount?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="is_applicable_for_all_users" value="Is Applicable For All Users" />
        <SwitchTwo id="is_applicable_for_all_users" @update:model-value="(arg) => form.is_applicable_for_all_users = arg"/>
        <span v-if="errors.is_applicable_for_all_users" class="text-red font-bold text-xs">{{ errors.is_applicable_for_all_users?.join() }}</span>
      </div>

      <div class="col-span-6" v-if="! form.is_applicable_for_all_users">
        <InputLabel for="user_id" value="Assign to user" />
        <Multiselect
          v-model="form.user_ids"
          :options="users"
          :multiple="true"
          :searchable="true"
          label="name"
          track-by="id"
          class="mt-1 block w-full"
          @search-change="searchActionUser"

        />
        <span v-if="errors.users_ids" class="text-red font-bold text-xs">{{ errors.users_ids?.join()}}</span>
      </div>

      <div class="col-span-6 ml-auto">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>

    </template>
  </FormSection>
</template>
