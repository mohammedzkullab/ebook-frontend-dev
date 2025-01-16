<script setup lang="ts">
import FormSection from '@/components/Forms/FormSection.vue';
import InputLabel from '@/components/Forms/InputLabel.vue';
import TextInput from '@/components/Forms/TextInput.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import router from "@/router/index";
import { ref, watch, onMounted } from 'vue';
import HTTP from '@/apis/HTTP.js';
import Multiselect from 'vue-multiselect' ;

const permissions = ref([]);
const selectedPermissions = ref([]);

const loading = ref(false);

const form = ref({
  roleName: '',
  permissionSearch: '',
 // selectedPermission: null,
});

const validateForm = () => {
  errors.value = {};

  if (!form.value.roleName) {
    errors.value.roleName = 'Role name is required';
  }

  return Object.keys(errors.value).length === 0;
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

/*const loadPermissions = async (page = null) => {
  loading.value = true;
  try {
    const res = await HTTP.action('permissions').withToken().paginate(page);
    permissions.value = res.data;
    console.log(permissions.value);
  } catch (err) {
    console.error("Failed to load permissions:", err);
  } finally {
    loading.value = false;
  }
};
const addPermissionToRole = () => {
  if (!form.value.selectedPermission) {
    return;
  }

  selectedPermissions.value.push(form.value.selectedPermission);
  form.value.selectedPermission = null;
};

const removePermissionFromRole = (permissions) => {
  selectedPermissions.value = selectedPermissions.value.filter(p => p.id !== permissions.id);
};*/

 /*const togglePermissionSelection = (permission) => {
  const index = selectedPermissions.value.findIndex(p => p.id === permission.id);
  if (index === -1) {
    selectedPermissions.value.push(permission);
  } else {
    selectedPermissions.value.splice(index, 1);
  }
}; */

const submit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    await HTTP.action('roles').withToken().post({
      roleName: form.value.roleName,
      permissions: selectedPermissions.value.map(permissions => permissions.id),
    });
    console.log('Role created successfully');
    router.push({ name: 'roles.index' });
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  loadPermissions();

});

const errors = ref({});
watch(form.value.permissionSearch, (newVal) => {
  loadPermissions(newVal);
});

</script>

<template>
  <FormSection @submitted="submit">
    <template #title>Roles</template>
    <template #description>Create a new role with specific permissions.</template>

    <template #form>
      <div class="col-span-6">
        <InputLabel for="roleName" value="Role Name" />
        <TextInput id="roleName" v-model="form.roleName" type="text" placeholder="Enter Role Name" class="mt-1 block w-full" />

      </div>

     <!-- <div class="col-span-6">
        <InputLabel for="permissions" value="Select Permissions" />
        <div class="mt-1">
          <div v-for="(item) in permissions.data" :key="item.id">
            <input
              type="checkbox"
              :id="'permission-' + item.id"
              :value="item"
              @change="togglePermissionSelection(item)"
              :checked="selectedPermissions.some(p => p.id === item.id)"
              class="rounded border-gray-300"
            />
            <label :for="'permission-' + item.id" class="text-gray-700 dark:text-gray-300">{{ item.name }}</label>
          </div>
        </div>
      </div> -->

      <div class="col-span-6">
        <InputLabel for="selectedPermissions" value="Select Permissions" />
        <Multiselect
          v-model="form.selectedPermissions"
          :options="permissions"
          :multiple="true"
          :searchable="true"
          label="name"
          track-by="id"
          placeholder="Select permissions"
          class="mt-1 block w-full"
        />
        <span v-if="errors.selectedPermissions" class="text-red-500 text-sm">{{ errors.selectedPermissions }}</span>
      </div>

      <div class="col-span-6 mt-4 ml-auto">
        <PrimaryButton type="submit">Create Role</PrimaryButton>
      </div>
    </template>
  </FormSection>
</template>
