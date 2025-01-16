<script setup>
import Readers from '@/components/Dashboard/Datatable.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div >
      <Readers
      />

    </div>
  </DefaultLayout>
</template>