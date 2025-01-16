<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import FormSection from "@/components/Forms/FormSection.vue";
import InputLabel from "@/components/Forms/InputLabel.vue";
import TextInput from "@/components/Forms/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import HTTP from '@/apis/HTTP.js';
import router from "@/router/index";
import Multiselect from 'vue-multiselect';
import Preloader from '@/components/Preloader.vue'

const route = useRoute();
const http = ref(HTTP)
const adminId = route.params.id;
const countries = ref([]);
const roles = ref([]);

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

const loadRoles = async (page = null) => {
  loading.value = true;
  try {
    const res = await HTTP.action('roles').withToken().paginate(page);
    roles.value = res.data.data.filter(role =>['ADMIN','SUPER_ADMIN'].includes(role.name));

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const loading = ref(false);
const form = ref({
  name: '',
  email: '',
  phone: '',
  phone_code:'',
  country_id: '',
  role: '',
  password: '',
  password_confirmation: '',
  status: 'false',
  image: null
});

const errors = ref<any>({})
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
}

const loadUserData = async () => {
  loading.value = true;
  try {
    const res = await HTTP.action(`admins/${adminId}`).withToken().get();
    const data = res.data.data;
    form.value = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      country_id: data.country,
      role: data.roles[0].name,
      password: '',
      password_confirmation: '',
      status : Boolean(data?.details?.status),
      image: null,
    };
    photoPreview.value = data.image ? data.image.original_url : null;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const photoInput = ref(null);

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

const photoPreview = ref(form.value.image ? form.value.image : null);

const submit = async () => {

  loading.value = true;

  const formData = new FormData();
  formData.append('_method', 'put');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      if (key === 'country_id' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.id);
      } else if (key === 'role' && typeof value === 'object' && 'id' in value) {
        formData.append(key, value.name);
      } else if (key === 'status'){
        formData.append(key, value?'1' : '0');
      }
      else {
        formData.append(key, value);
      }
    }
  });
  await HTTP.action(`admins/${adminId}`).withToken().post(formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => {
    router.push({ name: 'users.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
  }).finally(() => loading.value = false);
};

onMounted(() => {
  loadUserData();
  loadCountries();
  loadRoles();
});

let initialized = false;

watch(
  () => form.value.country_id,
  (newCountryId) => {
    if (initialized) {
      form.value.phone = newCountryId ? newCountryId.phone_code : '';
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
  <FormSection @submitted="submit">
    <template #title>
      Edit User
    </template>
    <template #description>
      Update the user details.
    </template>
    <template #form>
      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput
          v-model="form.name"
          id="name"
          type="text"
          placeholder="Type User Name"
          class="mt-1 block w-full"
        />
        <p class="text-gray-500 text-xs mt-1">Username must be between 3 and 20 characters.</p>
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="email" value="Email" />
        <TextInput
          v-model="form.email"
          id="email"
          type="email"
          placeholder="Type User Email"
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
        <InputLabel for="role" value="Role" />
        <select
          v-model="form.role"
          id="role"
          class="mt-1 block w-full border border-gray-300 rounded-md px-1 py-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <option value="" disabled selected>Select a role</option>
          <option v-for="(item, index) in roles" :key="index" :value="item.name">
            {{ item.name }}
          </option>
        </select>
        <span v-if="errors.role" class="text-red font-bold text-xs">{{ errors.role?.join() }}</span>
      </div>

      <div class="col-span-6 relative">
        <InputLabel for="password" value="Password" />

        <div class="relative">
          <TextInput
            v-model="form.password"
            :type="passwordVisible ? 'text' : 'password'"
            id="password"
            placeholder="Enter password"
            class="mt-1 block w-full pr-10"
          />

          <span
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            style="top: 50%; transform: translateY(-50%);"
          >
      <svg
        v-if="passwordVisible"
        class="fill-current"
        width="15"
        height="15"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M11 5C7.68629 5 5 7.68629 5 11C5 14.3137 7.68629 17 11 17C14.3137 17 17 14.3137 17 11C17 7.68629 14.3137 5 11 5ZM11 15C9.34315 15 8 13.6569 8 12C8 10.3431 9.34315 9 11 9C12.6569 9 14 10.3431 14 12C14 13.6569 12.6569 15 11 15Z"
            fill="currentColor"
          />
          <path
            d="M11 3C6.024 3 2.227 6.557 1 11C2.227 15.443 6.024 19 11 19C15.976 19 19.773 15.443 21 11C19.773 6.557 15.976 3 11 3ZM11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17Z"
            fill="currentColor"
          />
        </g>
      </svg>
      <svg
        v-else
        class="fill-current"
        width="15"
        height="15"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M11 3C6.024 3 2.227 6.557 1 11C2.227 15.443 6.024 19 11 19C15.976 19 19.773 15.443 21 11C19.773 6.557 15.976 3 11 3ZM11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17Z"
            fill="currentColor"
          />
          <path
            d="M11 15C9.34315 15 8 13.6569 8 12C8 10.3431 9.34315 9 11 9C12.6569 9 14 10.3431 14 12C14 13.6569 12.6569 15 11 15Z"
            fill="currentColor"
          />
          <path
            d="M3 3L19 19"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>
      </svg>
    </span>
        </div>

        <p class="text-gray-500 text-xs mt-1">Password must be at least 8 characters and contain both letters and numbers.</p>
        <span v-if="errors.password" class="text-red font-bold text-xs">{{ errors.password?.join() }}</span>
      </div>

      <div class="col-span-6 relative">
        <InputLabel for="password_confirmation" value="Confirm Password" />

        <div class="relative">
          <TextInput
            v-model="form.password_confirmation"
            :type="confirmPasswordVisible ? 'text' : 'password'"
            id="password_confirmation"
            placeholder="Confirm password"
            class="mt-1 block w-full pr-10"
          />
          <span
            @click="toggleConfirmPasswordVisibility"
            class="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            style="top: 50%; transform: translateY(-50%);"
          >
          <svg
            v-if="confirmPasswordVisible"
            class="fill-current"
            width="15"
            height="15"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M11 5C7.68629 5 5 7.68629 5 11C5 14.3137 7.68629 17 11 17C14.3137 17 17 14.3137 17 11C17 7.68629 14.3137 5 11 5ZM11 15C9.34315 15 8 13.6569 8 12C8 10.3431 9.34315 9 11 9C12.6569 9 14 10.3431 14 12C14 13.6569 12.6569 15 11 15Z"
                fill="currentColor"
              />
              <path
                d="M11 3C6.024 3 2.227 6.557 1 11C2.227 15.443 6.024 19 11 19C15.976 19 19.773 15.443 21 11C19.773 6.557 15.976 3 11 3ZM11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17Z"
                fill="currentColor"
              />
            </g>
          </svg>
          <svg
            v-else
            class="fill-current"
            width="15"
            height="15"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M11 3C6.024 3 2.227 6.557 1 11C2.227 15.443 6.024 19 11 19C15.976 19 19.773 15.443 21 11C19.773 6.557 15.976 3 11 3ZM11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17Z"
                fill="currentColor"
              />
              <path
                d="M11 15C9.34315 15 8 13.6569 8 12C8 10.3431 9.34315 9 11 9C12.6569 9 14 10.3431 14 12C14 13.6569 12.6569 15 11 15Z"
                fill="currentColor"
              />
              <path
                d="M3 3L19 19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </g>
          </svg>
          </span>
        </div>

        <span v-if="errors.password_confirmation" class="text-red font-bold text-xs">{{ errors.password_confirmation?.join() }}</span>
      </div>

      <div class="col-span-3 flex items-center">
        <input
          id="status"
          type="checkbox"
          v-model="form.status"
          class="mr-2"
        />
        <InputLabel for="status" value="Active" />
        <span v-if="errors.status" class="text-red font-bold text-xs ml-2">
         {{ errors.status?.join() }}
        </span>
      </div>

      <div class="col-span-6">
        <InputLabel for="image" value="Profile Image" />
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

    </template>

    <template #actions>
      <PrimaryButton>Update</PrimaryButton>
    </template>
  </FormSection>
</template>