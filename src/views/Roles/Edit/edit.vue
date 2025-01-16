<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Form from "@/views/Roles/Edit/Partials/Form.vue";
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div>
      <div>
        <Form />
      </div>
    </div>
  </DefaultLayout>
</template>