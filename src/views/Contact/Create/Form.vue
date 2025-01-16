<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FormSection from '@/components/Forms/FormSection.vue'
import InputLabel from '@/components/Forms/InputLabel.vue'
import TextInput from '@/components/Forms/TextInput.vue'
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'
import HTTP from '@/apis/HTTP.js'
import Preloader from '@/components/Preloader.vue'
import Pagination from '@/components/Paginations/Pagination.vue'
import Datatable from '@/components/Dashboard/Datatable.vue'

const loading = ref(false)
const errors = ref({})
const contacts = ref([])
const contactToView = ref(null);
const contactToDelete = ref(null);
const showDeleteModal = ref(false);
const showContactModal = ref(false);

const loadContacts = async (page = null) => {
  loading.value = true
  HTTP.action('contact-us')
    .withToken()
    .paginate(page)
    .then((res) => {
      contacts.value = res.data
    })
    .catch((err) => console.error(err))
    .finally(() => (loading.value = false))
}

const form = ref({
  name: '',
  email: '',
  phone: '',
  phone_2: '',
  address: '',
  social_media: []
})

const fetchContactSetting = async () => {
  loading.value = true

  try {
    const res = await HTTP.action('settings/4').withToken().get()
    const data = res.data.data
    form.value = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      phone_2: data.phone_2,
      address: data.address,
      social_media: data.social_media
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  console.log(form.value)
  try {
    await HTTP.action('settings').withToken().post({
      group: 'contact',
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      phone_2: form.value.phone_2,
      address: form.value.address,
      social_media: form.value.social_media
    })
    window.location.reload()
  } catch (err) {
    errors.value = err.response?.data?.errors || 'An unexpected error occurred.'
  }
}

const remove = (id) => {
  contactToDelete.value = id;
  showDeleteModal.value = true;
};

const view = () => {
  showContactModal.value = true;
};

const submitDelete = async () => {
  loading.value = true;
  try {
    await HTTP.action(`contact-us/${contactToDelete.value}`).withToken().delete();
    await loadContacts();
    closeDeleteModal();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  contactToDelete.value = null;
};

const closeContactModal = () => {
  contactToView.value = null;
  showContactModal.value = false;

};

onMounted(() => {
  fetchContactSetting()
  loadContacts()
})
</script>

<template>
  <preloader :loading="loading" />
  <FormSection @submitted="submit">
    <template #title> Contact Us </template>
    <template #description> Add contact information. </template>
    <template #form>
      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput
          v-model="form.name"
          id="name"
          type="text"
          placeholder="Type the Name"
          class="mt-1 block w-full"
        />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="email" value="Email" />
        <TextInput
          v-model="form.email"
          id="email"
          type="email"
          placeholder="Type the Email"
          class="mt-1 block w-full"
        />
        <span v-if="errors.email" class="text-red font-bold text-xs">{{
          errors.email?.join()
        }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="phone" value="Phone Number" />
        <div class="relative mt-1">
          <span class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-gray-500"
            >+966
          </span>
          <TextInput v-model="form.phone" id="phone" type="tel" class="block w-full pl-12" />
        </div>
        <span v-if="errors.phone" class="text-red font-bold text-xs">{{
          errors.phone?.join()
        }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="whatsapp" value="WhatsApp Number" />
        <div class="relative mt-1">
          <span class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-gray-500">+966</span>
          <TextInput v-model="form.phone_2" id="whatsapp" type="tel" class="block w-full pl-12" />
        </div>
        <span v-if="errors.phone_2" class="text-red font-bold text-xs">{{
          errors.phone_2?.join()
        }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="address" value="Address" />
        <TextInput
          v-model="form.address"
          id="address"
          type="text"
          placeholder="Type the address"
          class="mt-1 block w-full"
        />
        <span v-if="errors.address" class="text-red font-bold text-xs">{{
          errors.address?.join()
        }}</span>
      </div>

      <div class="col-span-6">
        <div class="mt-3" style="width: 200px">
          <p>Social Media Links :</p>
        </div>

        <InputLabel for="facebook" class="mt-4" value="Facebook" />
        <div class="flex items-center space-x-6 w-full">
          <TextInput
            v-model="form.social_media.facebook"
            id="facebook"
            type="url"
            placeholder="Facebook link"
            class="block w-full"
          />
        </div>

        <InputLabel for="instagram" class="mt-4" value="Insagram" />
        <div class="flex items-center space-x-6 w-full">
          <TextInput
            v-model="form.social_media.instagram"
            id="instagram"
            type="url"
            placeholder="Instagram link"
            class="block w-full"
          />
        </div>

        <InputLabel for="twitter" class="mt-4" value="X" />
        <div class="flex items-center space-x-6 w-full">
          <TextInput
            v-model="form.social_media.x"
            id="twitter"
            type="url"
            placeholder="X link"
            class="block w-full"
          />
        </div>

        <InputLabel for="linkedin" class="mt-4" value="Linkedin" />
        <div class="flex items-center space-x-6 w-full">
          <TextInput
            v-model="form.social_media.linkedin"
            id="linkedin"
            type="url"
            placeholder="Linkedin link"
            class="block w-full"
          />
        </div>

        <InputLabel for="youtube" class="mt-4" value="Youtube" />
        <div class="flex items-center space-x-6 w-full">
          <TextInput
            v-model="form.social_media.youtube"
            id="youtube"
            type="url"
            placeholder="Youtube link"
            class="block w-full"
          />
        </div>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>
    </template>
  </FormSection>

  <div class="flex flex-col gap-10">
    <div class="pt-6 pb-2.5 dark:border-strokedark xl:pb-1">
      <div class="max-w-full overflow-x-auto">
        <Datatable>
          <template #head>
            <tr class="uppercase dark:bg-[#24303f]">
              <th scope="col" class="py-3 px-2">Id</th>
              <th scope="col" class="py-3 px-2">name</th>
              <th scope="col" class="py-3">email</th>
              <th scope="col" class="py-3">created at</th>
              <th scope="col" class="py-3" style="justify-items: center">
                <svg
                  class="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219C19.25 8.28437 19.1125 8.18124 19.0781 8.04374C19.0437 7.90624 18.975 7.80312 18.9406 7.66562C18.8719 7.52812 18.9406 7.39062 19.0437 7.28749L19.1125 7.21874C19.4906 6.87499 19.6969 6.39374 19.6969 5.87812C19.6969 5.36249 19.525 4.88124 19.1469 4.50312L17.8062 3.12812C17.0844 2.37187 15.8469 2.33749 15.0906 3.09374L14.9875 3.16249C14.8844 3.26562 14.7125 3.29999 14.5406 3.23124C14.4031 3.16249 14.2656 3.09374 14.0937 3.05937C13.9219 2.99062 13.8187 2.85312 13.8187 2.71562V2.54374C13.8187 1.47812 12.9594 0.618744 11.8937 0.618744H9.96875C9.45312 0.618744 8.97187 0.824994 8.62812 1.16874C8.25 1.54687 8.07812 2.02812 8.07812 2.50937V2.64687C8.07812 2.78437 7.975 2.92187 7.8375 2.99062C7.76875 3.02499 7.73437 3.02499 7.66562 3.05937C7.52812 3.12812 7.35625 3.09374 7.25312 2.99062L7.18437 2.88749C6.84062 2.50937 6.35937 2.30312 5.84375 2.30312C5.32812 2.30312 4.84687 2.47499 4.46875 2.85312L3.09375 4.19374C2.3375 4.91562 2.30312 6.15312 3.05937 6.90937L3.12812 7.01249C3.23125 7.11562 3.26562 7.28749 3.19687 7.39062C3.12812 7.52812 3.09375 7.63124 3.025 7.76874C2.95625 7.90624 2.85312 7.97499 2.68125 7.97499H2.57812C2.0625 7.97499 1.58125 8.14687 1.20312 8.52499C0.824996 8.86874 0.618746 9.34999 0.618746 9.86562L0.584371 11.7906C0.549996 12.8562 1.40937 13.7156 2.475 13.75H2.57812C2.75 13.75 2.8875 13.8531 2.92187 13.9906C2.99062 14.0937 3.05937 14.1969 3.09375 14.3344C3.12812 14.4719 3.09375 14.6094 2.99062 14.7125L2.92187 14.7812C2.54375 15.125 2.3375 15.6062 2.3375 16.1219C2.3375 16.6375 2.50937 17.1187 2.8875 17.4969L4.22812 18.8719C4.95 19.6281 6.1875 19.6625 6.94375 18.9062L7.04687 18.8375C7.15 18.7344 7.32187 18.7 7.49375 18.7687C7.63125 18.8375 7.76875 18.9062 7.94062 18.9406C8.1125 19.0094 8.21562 19.1469 8.21562 19.2844V19.4219C8.21562 20.4875 9.075 21.3469 10.1406 21.3469H12.0656C13.1312 21.3469 13.9906 20.4875 13.9906 19.4219V19.2844C13.9906 19.1469 14.0937 19.0094 14.2312 18.9406C14.3 18.9062 14.3344 18.9062 14.4031 18.8719C14.575 18.8031 14.7125 18.8375 14.8156 18.9406L14.8844 19.0437C15.2281 19.4219 15.7094 19.6281 16.225 19.6281C16.7406 19.6281 17.2219 19.4562 17.6 19.0781L18.975 17.7375C19.7312 17.0156 19.7656 15.7781 19.0094 15.0219L18.9406 14.9187C18.8375 14.8156 18.8031 14.6437 18.8719 14.5406C18.9406 14.4031 18.975 14.3 19.0437 14.1625C19.1125 14.025 19.25 13.9562 19.3875 13.9562H19.4906H19.525C20.5562 13.9562 21.4156 13.1312 21.45 12.0656L21.4844 10.1406C21.4156 9.72812 21.2094 9.21249 20.8656 8.86874ZM19.8344 12.1C19.8344 12.3062 19.6625 12.4781 19.4562 12.4781H19.3531H19.3187C18.5281 12.4781 17.8062 12.9594 17.5312 13.6469C17.4969 13.75 17.4281 13.8531 17.3937 13.9562C17.0844 14.6437 17.2219 15.5031 17.7719 16.0531L17.8406 16.1562C17.9781 16.2937 17.9781 16.5344 17.8406 16.6719L16.4656 18.0125C16.3625 18.1156 16.2594 18.1156 16.1906 18.1156C16.1219 18.1156 16.0187 18.1156 15.9156 18.0125L15.8469 17.9094C15.2969 17.325 14.4719 17.1531 13.7156 17.4969L13.5781 17.5656C12.8219 17.875 12.3406 18.5625 12.3406 19.3531V19.4906C12.3406 19.6969 12.1687 19.8687 11.9625 19.8687H10.0375C9.83125 19.8687 9.65937 19.6969 9.65937 19.4906V19.3531C9.65937 18.5625 9.17812 17.8406 8.42187 17.5656C8.31875 17.5312 8.18125 17.4625 8.07812 17.4281C7.80312 17.2906 7.52812 17.2562 7.25312 17.2562C6.77187 17.2562 6.29062 17.4281 5.9125 17.8062L5.84375 17.8406C5.70625 17.9781 5.46562 17.9781 5.32812 17.8406L3.9875 16.4656C3.88437 16.3625 3.88437 16.2594 3.88437 16.1906C3.88437 16.1219 3.88437 16.0187 3.9875 15.9156L4.05625 15.8469C4.64062 15.2969 4.8125 14.4375 4.50312 13.75C4.46875 13.6469 4.43437 13.5437 4.36562 13.4406C4.09062 12.7187 3.40312 12.2031 2.6125 12.2031H2.50937C2.30312 12.2031 2.13125 12.0312 2.13125 11.825L2.16562 9.89999C2.16562 9.76249 2.23437 9.69374 2.26875 9.62499C2.30312 9.59062 2.40625 9.52187 2.54375 9.52187H2.64687C3.4375 9.55624 4.15937 9.07499 4.46875 8.35312C4.50312 8.24999 4.57187 8.14687 4.60625 8.04374C4.91562 7.35624 4.77812 6.49687 4.22812 5.94687L4.15937 5.84374C4.02187 5.70624 4.02187 5.46562 4.15937 5.32812L5.53437 3.98749C5.6375 3.88437 5.74062 3.88437 5.80937 3.88437C5.87812 3.88437 5.98125 3.88437 6.08437 3.98749L6.15312 4.09062C6.70312 4.67499 7.52812 4.84687 8.28437 4.53749L8.42187 4.46874C9.17812 4.15937 9.65937 3.47187 9.65937 2.68124V2.54374C9.65937 2.40624 9.72812 2.33749 9.7625 2.26874C9.79687 2.19999 9.9 2.16562 10.0375 2.16562H11.9625C12.1687 2.16562 12.3406 2.33749 12.3406 2.54374V2.68124C12.3406 3.47187 12.8219 4.19374 13.5781 4.46874C13.6812 4.50312 13.8187 4.57187 13.9219 4.60624C14.6437 4.94999 15.5031 4.81249 16.0875 4.26249L16.1906 4.19374C16.3281 4.05624 16.5687 4.05624 16.7062 4.19374L18.0469 5.56874C18.15 5.67187 18.15 5.77499 18.15 5.84374C18.15 5.91249 18.1156 6.01562 18.0469 6.11874L17.9781 6.18749C17.3594 6.70312 17.1875 7.56249 17.4625 8.24999C17.4969 8.35312 17.5312 8.45624 17.6 8.55937C17.875 9.28124 18.5625 9.79687 19.3531 9.79687H19.4562C19.5937 9.79687 19.6625 9.86562 19.7312 9.89999C19.8 9.93437 19.8344 10.0375 19.8344 10.175V12.1Z"
                    fill=""
                  ></path>
                  <path
                    d="M11 6.32498C8.42189 6.32498 6.32501 8.42186 6.32501 11C6.32501 13.5781 8.42189 15.675 11 15.675C13.5781 15.675 15.675 13.5781 15.675 11C15.675 8.42186 13.5781 6.32498 11 6.32498ZM11 14.1281C9.28126 14.1281 7.87189 12.7187 7.87189 11C7.87189 9.28123 9.28126 7.87186 11 7.87186C12.7188 7.87186 14.1281 9.28123 14.1281 11C14.1281 12.7187 12.7188 14.1281 11 14.1281Z"
                    fill=""
                  ></path>
                </svg>
              </th>
            </tr>
          </template>
          <template #body>
            <tr
              class="border-b border-bodydark"
              v-for="(item, index) in contacts.data"
              :key="index"
            >
              <td class="px-3 py-1">
                {{ ++index }}
              </td>
              <td class="py-2">
                {{ item.name }}
              </td>

              <td class="py-2">
                {{ item.email }}
              </td>
              <td class="py-2">
                {{ item.created_at }}
              </td>
              <td class="py-2 text-center">
                  <button @click="view()"
                          class="p-2 rounded-full hover:bg-gray-200 hover:text-primary transition duration-200">
                    <svg class="fill-current" width="19" height="19" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 4.5C7.5 4.5 3.73 7.61 2 12c1.73 4.39 5.5 7.5 10 7.5s8.27-3.11 10-7.5C20.27 7.61 16.5 4.5 12 4.5zm0 11.25A3.75 3.75 0 1 1 15.75 12 3.75 3.75 0 0 1 12 15.75zm0-6.25a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5z" />
                    </svg>
                  </button>
                <div
                  v-if="showContactModal"
                  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50 dark:bg-[#1a222c]"
                >
                  <div class="bg-white rounded-lg shadow-lg p-6 w-1/3 dark:bg-[#1a222c]">
                    <h2 class="text-xl font-semibold mb-4 dark:text-white">
                      Message
                    </h2>
                    <p class="font-semibold dark:text-white">{{ item.message }}</p>
                    <div class="flex justify-end space-x-2 mt-4">
                      <primary-button @click="closeContactModal">Cancel</primary-button>
                    </div>
                  </div>
                </div>
                <button @click="remove(item.id)" class="hover:text-primary">
                  <svg
                    class="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 15.4438C11.7004 16.0157 11.2623 16.4538 10.6904 16.4538H6.23414C5.66227 16.4538 5.22414 16.0157 5.22414 15.4438L4.78414 6.07502H12.1404L11.7285 15.4438Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </template>
          <template #pagination>
            <Pagination
              :data="contacts.links"
              @next="(args) => loadContacts(args)"
              @prev="(args) => loadContacts(args)"
            />
          </template>
        </Datatable>
      </div>
    </div>
  </div>

  <div
    v-if="showDeleteModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50 dark:bg-[#1a222c]"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-1/3 dark:bg-[#1a222c]">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">
        Are you sure you want to delete this Contact?
      </h2>
      <div class="flex justify-end space-x-2 mt-4">
        <primary-button @click="submitDelete">Yes, Delete</primary-button>
        <primary-button @click="closeDeleteModal">Cancel</primary-button>
      </div>
    </div>
  </div>
</template>
