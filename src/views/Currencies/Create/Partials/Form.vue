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
  name: '',
  code: '',
  value: '',
  symbol_left: '',
  symbol_right: '',
  decimal_place: '',
});

const submit = async () => {
  loading.value = true;

  await HTTP.action('currencies').withToken().post({
    name: form.value.name,
    code: form.value.code,
    value: form.value.value,
    symbol_left: form.value.symbol_left,
    symbol_right: form.value.symbol_right,
    decimal_place: form.value.decimal_place,
  }).then(res => {
    router.push({ name: 'currencies.index' });
  }).catch(err => {
    errors.value = err.response.data.errors
  }).finally(() => loading.value = false);
};


</script>

<template>
  <FormSection @submitted="submit">
    <template #title>Currencies</template>
    <template #description>Add a new Currency.</template>

    <template #form>

      <div class="col-span-6">
        <InputLabel for="name" value="Name" />
        <TextInput id="name" v-model="form.name" type="text" placeholder="Enter Currency Name" class="mt-1 block w-full" />
        <span v-if="errors.name" class="text-red font-bold text-xs">{{ errors.name?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="code" value="Code" />
        <TextInput id="code" v-model="form.code" type="text" placeholder="Enter Currency Code" class="mt-1 block w-full" />
        <span v-if="errors.code" class="text-red font-bold text-xs">{{ errors.code?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="value" value="Value" />
        <TextInput id="value" v-model="form.value" type="text" placeholder="Enter Currency Value" class="mt-1 block w-full" />
        <span v-if="errors.value" class="text-red font-bold text-xs">{{ errors.value?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="symbol_left" value="Symbol Left" />
        <TextInput id="symbol_left" v-model="form.symbol_left" type="text" placeholder="Enter Currency Symbol Left" class="mt-1 block w-full" />
        <span v-if="errors.symbol_left" class="text-red font-bold text-xs">{{ errors.symbol_left?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="symbol_right" value="Symbol Right" />
        <TextInput id="symbol_right" v-model="form.symbol_right" type="text" placeholder="Enter Currency Symbol Right" class="mt-1 block w-full" />
        <span v-if="errors.symbol_right" class="text-red font-bold text-xs">{{ errors.symbol_right?.join() }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="decimal_place" value="Decimal Place" />
        <TextInput id="decimal_place" v-model="form.decimal_place" type="text" placeholder="Enter Currency Decimal Place" class="mt-1 block w-full" />
        <span v-if="errors.decimal_place" class="text-red font-bold text-xs">{{ errors.decimal_place?.join() }}</span>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>

    </template>
  </FormSection>
</template>

