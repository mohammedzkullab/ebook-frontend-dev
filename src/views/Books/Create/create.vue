<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Form from "@/views/Books/Create/Partials/Form.vue";
import {ref} from "vue";

const loading = ref(false);

const setLoading = (isLoading) => {
  loading.value = !! isLoading
}
</script>

<template>
  <DefaultLayout :loading="loading">
    <BreadcrumbDefault />
    <div>
      <div>
        <Form @loading="setLoading"/>
      </div>
    </div>
  </DefaultLayout>
</template>
