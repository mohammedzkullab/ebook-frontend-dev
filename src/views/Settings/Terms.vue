<script setup>

import Terms from '@/components/Dashboard/Terms.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const apiEndpoint = "https://api-endpoint.com/terms";
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <Terms :api-url="apiEndpoint" />
    </div>
  </DefaultLayout>
</template>
