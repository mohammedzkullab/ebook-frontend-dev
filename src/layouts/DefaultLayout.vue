<script setup lang="ts">
import HeaderArea from '@/components/Header/HeaderArea.vue'
import SidebarArea from '@/components/Sidebar/SidebarArea.vue'
import Preloader from "@/components/Preloader.vue";

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
<div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden " >
      <!-- ===== Header Start ===== -->
      <HeaderArea />
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <preloader :loading="loading"/>
       <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 bg-white dark:bg-[#1a222c] min-h-[100vh]">
          <slot></slot>
        </div>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>
