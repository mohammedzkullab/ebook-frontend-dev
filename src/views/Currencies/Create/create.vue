<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Form from "@/views/Currencies/Create/Partials/Form.vue";
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault />
    <div>
      <div>
        <Form />
      </div>
    </div>
  </DefaultLayout>
</template>