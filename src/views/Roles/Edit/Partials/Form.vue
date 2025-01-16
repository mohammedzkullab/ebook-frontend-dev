<script setup lang="ts">
import Multiselect from 'vue-multiselect' ;
import { useRoute, useRouter } from 'vue-router';
import FormSection from '@/components/Forms/FormSection.vue';
import InputLabel from '@/components/Forms/InputLabel.vue';
import TextInput from '@/components/Forms/TextInput.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { ref, onMounted } from 'vue';
import HTTP from '@/apis/HTTP.js';
import Preloader from '@/components/Preloader.vue'

const route = useRoute();
const router = useRouter();
const permissions = ref([]);
const name = route.params.name;
const roles = ref([]);
const selectedPermissions = ref([]);
const errors = ref({});
const loading = ref(false);
const roleID = ref('');

const form = ref({
  name: '',
  selectedPermissions: [],
});

const loadRoles = async () => {
  loading.value = true;
  try {
    const response = await HTTP.action('roles').withToken().get();
    roles.value = response.data.data.filter(role => role.name === name);
    roleID.value = roles.value[0].id
    form.value = {
      name: roles.value[0].name || '',
      selectedPermissions: roles.value[0].permissions,
    };
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadPermissions = async () => {
  try {
    const response = await HTTP.action('permissions').withToken().get();
    permissions.value = Array.isArray(response.data.data) ? response.data.data : response.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const submit = async () => {

  try {
    await HTTP.action(`roles/${roleID.value}`).withToken().put({
      name: form.value.name,
      permissions: form.value.selectedPermissions.map(permission => permission.id),
    });
    router.push({ name: 'roles.index' });
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error("Validation Errors:", error.response.data.errors);
    } else {
      console.error("Error:", error);
    }
  }
};

onMounted(() => {
  loadPermissions();
  loadRoles();
});
</script>

<template>
  <preloader :loading="loading"/>
  <FormSection @submitted="submit">
    <template #title>Edit Role</template>
    <template #description>Edit the role name and permissions.</template>

    <template #form>
      <div class="col-span-6">
        <InputLabel for="name" value="Role Name" />
        <TextInput id="name" v-model="form.name" type="text" placeholder="Enter Role Name" 
        :disabled="true"
        class="mt-1 block w-full" />
        <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
      </div>

      <div class="col-span-6">
        <InputLabel for="selectedPermissions" value="Select Permissions" />
        <Multiselect
          v-model="form.selectedPermissions"
          :options="permissions"
          :multiple="true"
          :close-on-select="false"
          :searchable="true"
          label="name"
          track-by="id"
          placeholder="Select permissions"
          class="mt-1 block w-full"
        />
        <span v-if="errors.selectedPermissions" class="text-red-500 text-sm">{{ errors.selectedPermissions }}</span>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Update Role</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>


