<script setup>
import AboutUs from '@/components/Dashboard/AboutUs.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const apiEndpoint = 'https://api-endpoint.com/aboutUs';
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <AboutUs :apiEndpoint="apiEndpoint" />
    </div>
  </DefaultLayout>
</template>
