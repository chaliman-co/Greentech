<template>
  <div class=" flex justify-content-center align-items-center py-4">
    <div class="surface-card p-4 shadow-2  border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Add Category</div>
      </div>

      <form @submit.prevent="submit($event)">
        <fieldset :disabled="loading" class="border-none">
          <label for="name" class="block text-900 font-medium mb-2">Name</label>
          <small class="p-error" id="text-error">{{ errors.name || '' }}</small>
          <InputText id="name" class="w-full mb-3" :class="{ 'p-invalid': errors.name }" @input="errors.name = null"
            name="name" v-model="name" required />

          <div class="flex justify-content-around">
            <Button :label="loading ? 'Adding' : 'Add'" class="w-9" :loading="loading" type="submit"></Button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex"
import InputText from "primevue/inputtext"
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { errorNotification, successNotification, handleErrors } from "@/util";
import { JsonBody, postToApi } from "../../util";

const loading = ref(false)
const errors = ref({})
const store = useStore();
const name = ref()

async function submit(event) {
  loading.value = true;
  const data = {
    name: name.value,
  }
  try {
    let response = await postToApi(
      `/categories`,
      new JsonBody(data)
    );
    if (response.failed) {
      errors.value = handleErrors(response, false);
    } else {
      store.commit("add_category", response.data)
      successNotification(`Category was added successfully`);
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
}

</script>