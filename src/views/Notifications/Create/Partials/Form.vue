<script setup lang="ts">
import FormSection from '@/components/Forms/FormSection.vue'
import InputLabel from '@/components/Forms/InputLabel.vue'
import TextInput from '@/components/Forms/TextInput.vue'
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import { ref, computed } from 'vue'
import HTTP from '@/apis/HTTP.js'
import TextArea from '@/components/Forms/TextArea.vue'
import router from '@/router'

const errors = ref<any>({});
const notificationTypes = ref(['Important', 'Normal']);
const loading = ref(false);

const form = ref({
  title: '',
  image: null,
  message: '',
  send_date: '',
  send_time: '',
  type: ''
});

function formatSendTime(value) {
  const timeParts = value.split(':');
  if (timeParts.length === 2) {
    const [hours, minutes] = timeParts;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  }
  return value;
}

const submit = async () => {
  loading.value = true;

  const formData = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      if (key === 'send_time') {
        const formattedTime = formatSendTime(value);
        formData.append(key, formattedTime);
      } else {
        formData.append(key, value);
      }
    }
  });

  await HTTP.action('notification-details').withToken().post(formData)
    .then(() => {
      router.push({ name: 'Notifications.index' });
    })
    .catch(err => {
      errors.value = err.response.data.errors;
    })
    .finally(() => loading.value = false);
};

const close = async () => {
  router.push({ name: 'Notifications.index' });
}

const photoInput = ref(null);
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

const photoPreview = ref(null);

</script>

<template>
  <FormSection @submitted="submit">
    <template #title>Notification</template>
    <template #description>Add a new notification.</template>
    <template #form>

      <div class="col-span-6">
        <InputLabel for="title" value="Title" />
        <TextInput id="title" v-model="form.title" type="text" placeholder="Enter Notification Title" class="mt-1 block w-full" />
        <span v-if="errors.title" class="text-red font-bold text-xs">{{ errors.title?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="message" value="Message" />
        <TextArea id="message" v-model="form.message" type="text" placeholder="Enter Notification Message" class="mt-1 block w-full" />
        <span v-if="errors.message" class="text-red font-bold text-xs">{{ errors.message?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="send_date" value="Send Date" />
        <TextInput id="send_date" v-model="form.send_date" type="date" class="mt-1 block w-full" />
        <span v-if="errors.send_date" class="text-red font-bold text-xs">{{ errors.send_date?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="send_time" value="Send Time" />
        <TextInput id="send_time" v-model="form.send_time" type="time" class="mt-1 block w-full" />
        <span v-if="errors.send_time" class="text-red font-bold text-xs">{{ errors.send_time?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="type" value="Type" />
        <div class="space-x-4">
          <label v-for="type in notificationTypes" :key="type">
            <input type="radio" v-model="form.type" :value="type" /> {{ type }}
          </label>
        </div>
        <span v-if="errors.type" class="text-red font-bold text-xs">{{ errors.type?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="image" value=" Image" />
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
        <span v-if="errors.image" class="text-red font-bold text-xs">{{ errors.image?.join() }}</span>
      </div>

      <div class="col-span-6 mt-3 flex justify-end space-x-4 mr-32">
        <PrimaryButton type="submit">Save</PrimaryButton>
       <PrimaryButton type="submit" >Save and Send</PrimaryButton>
        <PrimaryButton type="button" @click="close">Close</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>
