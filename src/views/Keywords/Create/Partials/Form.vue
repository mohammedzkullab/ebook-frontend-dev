<script setup lang="ts">
import FormSection from '@/components/Forms/FormSection.vue';
import InputLabel from '@/components/Forms/InputLabel.vue';
import TextInput from '@/components/Forms/TextInput.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { ref } from 'vue';
import HTTP from '@/apis/HTTP.js';
import router from '@/router'

const errors = ref<any>({})
const loading = ref(false);

const form = ref({
  keyword: '',
});

const submit = async () => {
  loading.value = true;
  await HTTP.action('keywords').withToken().post({
    keyword: form.value.keyword,
  }).then(res => {
    router.push({ name: 'keywords.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
  }).finally(() => loading.value = false);
};


</script>

<template>
  <FormSection @submitted="submit">
    <template #title>Keywords</template>
    <template #description>Add a new Keyword.</template>

    <template #form>

      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput id="name" v-model="form.keyword" type="text" placeholder="Enter Keyword Name" class="mt-1 block w-full" />
        <span v-if="errors.keyword" class="text-red font-bold text-xs">{{ errors.keyword?.join() }}</span>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>

    </template>
  </FormSection>
</template>

