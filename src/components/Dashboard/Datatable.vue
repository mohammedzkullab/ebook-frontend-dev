<template>
  <div class="rounded-sm border border-stroke bg-white pb-2.5 dark:border-strokedark dark:bg-boxdark xl:pb-1 bg-[#a57d5300]">
    <div class="relative overflow-x-auto sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead class="text-xs text-gray-700 uppercase bg-[#f9fbfc] dark:bg-gray-700 dark:text-gray-400">
        <slot name="head"></slot>
        </thead>
        <tbody>
        <slot name="body"></slot>
        </tbody>
      </table>
    </div>
  </div>
  <slot name="pagination"></slot>
</template>


<script setup lang="ts">
</script>
