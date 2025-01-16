<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <section class="bg-white dark:bg-gray-900 min-h-screen flex items-center">
      <div class="container px-6 mx-auto flex flex-col lg:flex-row items-center justify-between">

        <div class="w-full lg:w-1/2 text-center lg:text-left">
          <p class="text-sm font-medium text-red-500 dark:text-red-400">404 Error</p>
          <h1 class="mt-3 text-3xl font-semibold text-gray-800 dark:text-white md:text-4xl">Permission Denied</h1>
          <p class="mt-4 text-gray-500 dark:text-gray-400">
            Your account does not have the required permissions to view this content.
          </p>

        </div>

        <div class="w-full lg:w-1/2 mt-8 lg:mt-0">
          <img
            class="w-full max-w-md lg:max-w-lg mx-auto"
            :style="{ maxHeight: '90vh' }"
            src="./../assets/images/404.svg"
            alt="Permission Denied"
          />
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
