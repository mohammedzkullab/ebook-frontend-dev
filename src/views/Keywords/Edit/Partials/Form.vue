<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FormSection from "@/components/Forms/FormSection.vue";
import InputLabel from "@/components/Forms/InputLabel.vue";
import TextInput from "@/components/Forms/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import HTTP from '@/apis/HTTP.js';
import router from '@/router'
import { useRoute } from 'vue-router'
import Preloader from '@/components/Preloader.vue'

const errors = ref<any>({})
const loading = ref(false);

const form = ref({
  keyword: '',
});

const route = useRoute();
const keywordId = route.params.id;

const loadPackage = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action(`keywords/${keywordId}`).withToken().get();
    const keywordData = response.data;
    form.value.keyword = keywordData.data.keyword;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  loading.value = true;
  await HTTP.action(`keywords/${keywordId}`).withToken().put({
    keyword: form.value.keyword,
  }).then(res => {
    router.push({ name: 'keywords.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
  }).finally(() => loading.value = false);
};

onMounted(() => {
  loadPackage();
});

</script>

<template>
  <preloader :loading="loading"/>
  <FormSection @submitted="submit">
    <template #title>Edit Keyword</template>
    <template #description>Edit the details of the keyword.</template>

    <template #form>

      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput id="name" v-model="form.keyword" type="text" placeholder="Enter Keyword Name" class="mt-1 block w-full" />
        <span v-if="errors.keyword" class="text-red font-bold text-xs">{{ errors.keyword?.join() }}</span>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Update</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>
