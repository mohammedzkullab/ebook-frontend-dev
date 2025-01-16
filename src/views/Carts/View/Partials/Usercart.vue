<script setup lang="ts">
import {onMounted, ref} from "vue";
import HTTP from "@/apis/HTTP.js";
import {useRoute, useRouter} from "vue-router";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TimeAdapter from "@/components/Converter.js"

const loading = ref(false);
const showDeleteModal = ref(false);
const deleteReason = ref("");
const route = useRoute();
const router = useRouter();
const cartId = route.params.id;

const form = ref({
  id: '',
  tax_rate: '',
  tax_price: '',
  shipping_price: '',
  items_count: '',
  total_price: '',
  total_price_discount: '',
  created_at: '',
  items: [],
  user: '',
})

const loadCart = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action(`carts/${cartId}`).withToken().get();
    const cartData = response.data?.data?.cart;
    form.value = {
      ...cartData,
      user: cartData?.user?.user || {} 
    };
  } finally {
    loading.value = false;
  }
};


const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteReason.value = "";
};

const submitDelete = async () => {
  if (!deleteReason.value) {
    alert("Please provide a reason for deletion.");
    return;
  }

  loading.value = true;
  HTTP.action(`carts/${cartId}`)
    .withToken()
    .delete({ reason: deleteReason.value })
    .then(() => {
      alert("Cart deleted successfully.");
      router.push({name :'carts.index'});
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to delete the cart.");
    })
    .finally(() => {
      loading.value = false;
      closeDeleteModal();
    });
};

const cancel = () => {
  router.push({name : 'carts.index'})
}

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div class="p-6" id="app">
    <!-- Header Section with Delete and Cancel Buttons -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Cart Detail</h1>
      <div class="flex space-x-2">
        <PrimaryButton @click="openDeleteModal">Delete</PrimaryButton>
<!--        <PrimaryButton @click="cancel">Cancel</PrimaryButton>-->
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow mb-6 dark:border-strokedark dark:bg-boxdark dark:text-white">
          <div class="flex justify-between items-center mb-4 dark:border-strokedark dark:bg-boxdark dark:text-white">
            <h2 class="text-lg font-semibold">Summary</h2>
            <div class="flex items-center space-x-2 text-gray-500">
              <i class="far fa-calendar-alt"></i>
              <span>{{ TimeAdapter.humanable(form.created_at) }}</span>
            </div>
          </div>
          <div v-for="(book, index) in form.items ?? []" :key="index">
            <div class="flex items-center mb-4 pt-5">
              <img
                :alt="book.item.name"
                :src="book.item.main_image.original_url"
                class="w-14 h-14 rounded mr-4 object-contain"
              />
              <div>
                <h3 class="font-semibold">{{ book.item.name }}</h3>
                <p class="text-gray-500">{{ book.item.sku }}</p>
              </div>
              <div class="ml-auto text-right">
                <p class="font-semibold">{{ book.item.price }} Per Item × {{ book.quantity }} Quantity</p>
                <p class="font-semibold">{{ form.total_price }} Total Price</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow dark:border-strokedark dark:bg-boxdark dark:text-white">
          <h2 class="text-lg font-semibold mb-4">Customer</h2>
          <div class="flex items-center mb-4">
            <img
              alt="Customer avatar"
              class="w-8 h-8 rounded-full mr-4"
              height="30"
              src="/src/assets/images/user/user-13.png"
              width="30"
            />
            <div>
              <p class="font-semibold">{{ form?.user?.name ?? '-' }}</p>
              <p class="text-gray-500">{{ form?.user?.email ?? '-' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow dark:border-strokedark dark:bg-boxdark dark:text-white">
          <h2 class="text-lg font-semibold mb-4">Shipping Address</h2>
          <div class="flex items-center mb-4">
            <img
              alt="Shipping address avatar"
              class="w-8 h-8 rounded-full mr-4"
              height="30"
              src="/src/assets/images/user/user-13.png"
              width="30"
            />
            <div>
              <p class="font-semibold">{{ form?.user?.name ?? '-' }}</p>
              <p class="text-gray-500">{{ form?.user?.email ?? '-' }}</p>
            </div>
          </div>
          <div class="mb-4">
            <p class="text-gray-500">Phone</p>
            <p class="text-gray-500">{{ form?.user?.phone ?? '-' }}</p>
          </div>
          <div>
            <p class="text-gray-500">Address</p>
            <p class="font-semibold">
              {{ form?.user?.country?.name?? '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 class="text-xl font-semibold mb-4">Reason for Deletion</h2>
        <textarea
          v-model="deleteReason"
          class="w-full h-24 p-2 border border-gray-300 rounded"
          placeholder="Enter the reason for deletion here..."
        ></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <PrimaryButton @click="submitDelete">Submit</PrimaryButton>
          <PrimaryButton @click="closeDeleteModal">Cancel</PrimaryButton>
        </div>
      </div>
    </div>

  </div>
</template>
