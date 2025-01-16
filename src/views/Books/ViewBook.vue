<script setup>
import Books from '@/components/Dashboard/Datatable.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault/>

    <div class="flex flex-col gap-10">
      <Books
      />

    </div>
  </DefaultLayout>
</template>