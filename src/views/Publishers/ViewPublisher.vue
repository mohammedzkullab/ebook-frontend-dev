<script setup>
import Publishers from '@/components/Dashboard/Datatable.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="flex flex-col gap-10">
      <Publishers
      />

    </div>
  </DefaultLayout>
</template>
