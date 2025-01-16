<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import OrderPage from "@/views/Orders/View/Partials/Orderpage.vue";
</script>

<template>
  <DefaultLayout>
    <div>
      <div>
        <OrderPage />
      </div>
    </div>

  </DefaultLayout>
</template>