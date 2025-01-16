<template>
  <div v-if="loading" class="fixed w-full justify-center items-center h-full z-50 bg-graydark opacity-70 inset-0 flex bg-gray-800">
    <!-- Spinner -->
    <div class="content-center justify-center bg-center m-auto">
      <div class="animate-spin rounded-full h-16 w-16 border-blue-500 ms-10">
        <img src="/src/assets/images/user/Group 1984077728.png" alt="User" />
      </div>
      <h1 class="uppercase text-white font-bold">afaq almaarefa</h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  }
}
</script>
