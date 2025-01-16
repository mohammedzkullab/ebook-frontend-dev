<script setup>
import Author from '@/components/Dashboard/Datatable.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div>
      <Author
      />

    </div>
  </DefaultLayout>
</template>