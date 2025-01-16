<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Auth } from '@/stores/Auth'
import HTTP from '@/apis/HTTP.js'
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TextInput from "@/components/Forms/TextInput.vue";
import TextArea from "@/components/Forms/TextArea.vue";
import router from '@/router'
import { load } from '@syncfusion/ej2-vue-richtexteditor'
import Preloader from '@/components/Preloader.vue'
const form = ref({
  id: '',
  phone: '',
  email: '',
  address: '',
  message: '',
  tax_percentage: '',
  top_selling_period: '',
  image: null
})

const photoPreview = ref('');
const selectedFile = ref(null);
const errors = ref<any>({})
const loading = ref(false);

const fetchGeneralSetting = async () => {
  loading.value = true;

  try {
    const res = await HTTP.action('settings/1').withToken().get();
    const data = res.data.data;
    form.value = {
      phone: data.phone,
      email: data.email,
      address: data.address,
      message: data.message,
      tax_percentage: data.tax_percentage,
      top_selling_period: data.top_selling_period,
      image: null,
    };
    photoPreview.value = data.image ? data.image.original_url : '/src/assets/images/logo/Layer_1.png';
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {

  const formData = new FormData();
  formData.append('group', 'general');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  try {
    await HTTP.action(`settings`).withToken().post(formData);
    window.location.reload();
  } catch (err) {
    errors.value = err.response?.data?.errors || 'An unexpected error occurred.';
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handlePhotoSubmit = async () => {
  if (selectedFile.value) {
    const formDataToUpload = new FormData();
    formDataToUpload.append('group', 'general');
    formDataToUpload.append('image', selectedFile.value);

    try {
      await HTTP.action('settings').withToken().post(formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.reload();
    } catch (err) {
      errors.value = err.response?.data?.errors || 'An unexpected error occurred.';
    }
  }
};

const handleTaxSubmit = async () => {
  const formData = new FormData();
  formData.append('group', 'general');
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  try {
    await HTTP.action(`settings`).withToken().post(formData);
    window.location.reload();
  } catch (err) {
    errors.value = err.response?.data?.errors || 'An unexpected error occurred.';
  }
};

const handleCancel = () => {
  fetchGeneralSetting();
};

onMounted(() => {
  fetchGeneralSetting();
});

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
  <div class="grid grid-cols-5 gap-8">
    <div class="col-span-5 xl:col-span-3">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">General Information's</h3>
        </div>
        <div class="p-7">
          <form @submit.prevent="handleSubmit">

            <div class="mb-5.5">
              <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="emailAddress">Email</label>
              <TextInput
                v-model="form.email"
                class="mt-1 block w-full "
                type="email"
                name="emailAddress"
                id="emailAddress"
              />
              <span v-if="errors.email" class="text-red font-bold text-xs">{{ errors.email?.join() }}</span>

            </div>


            <div class="mb-5.5">
              <label
                class="mb-3 block text-sm font-medium text-black dark:text-white"
                for="Address"
              >Address</label
              >
              <TextInput
                v-model="form.address"
                type="text"
                class="mt-1 block w-full "
                name="Adress"
                id="Address"
              />
              <span v-if="errors.address" class="text-red font-bold text-xs">{{ errors.address?.join() }}</span>
            </div>

            <div class="mb-5.5">
              <label
                class="mb-3 block text-sm font-medium text-black dark:text-white"
                for="phoneNumber"
              >Phone Number</label
              >
              <TextInput
                v-model="form.phone"
                type="text"
                class="mt-1 block w-full "
                name="phoneNumber"
                id="phoneNumber"
                 @input="validatePhone"
              />
              <span v-if="errors.phone" class="text-red font-bold text-xs">{{ errors.phone?.join() }}</span>
            </div>

            <div class="mb-5.5">
              <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="message"
              >Message</label
              >
              <div class="relative">

                <TextArea
                  v-model="form.message"
                  class="mt-1 block w-full "
                  name="message"
                  id="message"
                  rows="6"
                ></TextArea>
              </div>
              <span v-if="errors.message" class="text-red font-bold text-xs">{{ errors.message?.join() }}</span>
            </div>


            <div class="flex justify-end gap-4.5">
              <button
                class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                @click="handleCancel"
              >
                Cancel
              </button>
              <PrimaryButton

                type="submit"
              >
                Save
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>


    <div class="col-span-5 xl:col-span-2">
      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="border-b border-stroke py-1 px-7 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Platform Logo</h3>
        </div>
        <div class="p-7">
          <form @submit.prevent="handlePhotoSubmit">

            <div class="mb-4 flex gap-3">
              <div class="h-14 w-14 rounded-full">
                <img :src="photoPreview" alt="User" />
              </div>
              <div>
                <span class="mb-1.5 font-medium text-black dark:text-white">Edit Logo</span>
              </div>
            </div>


            <div
              id="FileUpload"
              class="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary py-3 px-3 dark:bg-meta-4 sm:py-7.5"
            >
              <input
                type="file"
                accept="image/*"
                class="absolute inset-0 z-50 m-0 h-50 w-50 cursor-pointer p-0 opacity-0 outline-none"
                @change="handleFileChange"
              />
              <div class="flex flex-col items-center justify-center space-y-3">
                <span
                  class="flex h-4 w-4 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                      fill="#3C50E0"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                      fill="#3C50E0"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                      fill="#3C50E0"
                    />
                  </svg>
                </span>
                <p class="text-sm font-medium">
                  <span class="text-primary">Click to upload</span> or drag and drop
                </p>
                <p class="mt-1.5 text-sm font-medium">SVG, PNG, JPG or GIF</p>
                <p class="text-sm font-medium">(max, 800 X 800px)</p>
                <span v-if="errors.image" class="text-red font-bold text-xs">{{ errors.image?.join() }}</span>

              </div>
            </div>


            <div class="flex justify-end gap-4.5">
              <button
                class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                @click="handleCancel"
              >
                Cancel
              </button>
              <primaryButton

                type="submit"
              >
                Save
              </primaryButton>
            </div>


          </form>
        </div>

      </div>
      <div class="col-span-5 xl:col-span-2 mt-1">
        <div
          class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >

          <div class="p-3">
            <form @submit.prevent="handleTaxSubmit">
              <div class="mb-5.5">
                <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="vatRate">
                  VAT Rate (%)
                </label>
                <TextInput
                  v-model="form.tax_percentage"
                  class="mt-1 block w-full "
                  type="number"
                  name="vatRate"
                  id="vatRate"
                  min="0"
                  step="0.01"
                  max="100"
                />
                <span class="text-red-500 text-xs">Value cannot exceed 100%</span>
                <span v-if="errors.tax_percentage" class="text-red font-bold text-xs">{{ errors.tax_percentage?.join() }}</span>

              </div>

              <!-- Best-Selling Period Section -->

              <div class="">
                <label class="mb-3 block text-sm font-medium text-black dark:text-white">Set Best-Selling Period</label>
                <div class="flex items-center">
                  <input
                    type="radio"
                    id="weekly"
                    value="week"
                    v-model="form.top_selling_period"
                    class="mr-2"
                  />
                  <label for="weekly" class="mr-4">Week</label>

                  <input
                    type="radio"
                    id="monthly"
                    value="month"
                    v-model="form.top_selling_period"
                    class="mr-2"
                  />
                  <label for="monthly" class="mr-4">Month</label>

                  <input
                    type="radio"
                    id="yearly"
                    value="year"
                    v-model="form.top_selling_period"
                    class="mr-2"
                  />
                  <label for="yearly">Year</label>
                </div>
                <span v-if="errors.top_selling_period" class="text-red font-bold text-xs">{{ errors.top_selling_period?.join() }}</span>
              </div>


              <div class="flex justify-end gap-4.5">
                <button
                  class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  type="button"
                  @click="handleCancel"
                >
                  Cancel
                </button>
                <PrimaryButton

                  type="submit"
                >
                  Save
                </PrimaryButton>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
