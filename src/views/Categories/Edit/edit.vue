<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Form from "@/views/Categories/Edit/Partials/Form.vue";
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