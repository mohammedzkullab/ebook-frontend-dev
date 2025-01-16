<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import UserCart from "@/views/Carts/View/Partials/Usercart.vue";
</script>

<template>
  <DefaultLayout>
    <div>
      <div>
        <UserCart />
      </div>
    </div>

  </DefaultLayout>
</template>