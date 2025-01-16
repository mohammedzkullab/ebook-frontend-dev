<script setup lang="ts">

import {ref} from "vue";

let isAscDirection = ref(true)

const emit = defineEmits([
    'orderBy'
])

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  filter: {
    type: String,
    required: true
  }
})

const orderBy = (filter: string) => {
  isAscDirection.value = !isAscDirection.value
  const sort = `${filter}|${isAscDirection.value ? 'asc' : 'desc'}`
  emit('orderBy', sort)
}
</script>

<template>
  <div class="flex items-center" @click="orderBy(filter)">
    {{ name }}
    <a href="#">
      <svg class="w-6 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" :fill="isAscDirection ? 'currentColor': 'none'" viewBox="0 0 24 24">
        <path fill-rule="evenodd" stroke="currentColor" d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z" clip-rule="evenodd"/>
      </svg>

      <svg class="w-6 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" :fill="!isAscDirection ? 'currentColor': 'none'" viewBox="0 0 24 24">
        <path fill-rule="evenodd" stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M7.119 8h9.762a1 1 0 0 1 .772 1.636l-4.881 5.927a1 1 0 0 1-1.544 0l-4.88-5.927A1 1 0 0 1 7.118 8Z"/>
      </svg>
    </a>
  </div>
</template>
