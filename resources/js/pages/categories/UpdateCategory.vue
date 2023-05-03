<template>
  <div class=" flex justify-content-center align-items-center py-4">
    <div class="surface-card p-4 shadow-2  border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">{{ category.name }}</div>
      </div>

      <form @submit.prevent="submit($event)">
        <fieldset :disabled="loading" class="border-none">
          <label for="name" class="block text-900 font-medium mb-2">Name</label>
          <small class="p-error" id="text-error">{{ errors.name || '' }}</small>
          <InputText id="name" class="w-full mb-3" :class="{ 'p-invalid': errors.name }" @input="errors.name = null"
            name="name" v-model="name" required />
          <div class="flex justify-content-around">
            <Button label="Delete" @click="deleteCategory()" style="background-color: var(--red-700);"></Button>
            <Button :label="loading ? 'Updating' : 'Update'" class="w-9" :loading="loading" type="submit"></Button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import InputText from "primevue/inputtext"
import Button from "primevue/button";
import { updateAtApi, errorNotification, successNotification, handleErrors, getFromApi, JsonBody, redirect, deleteFromApi } from "@/util";

const loading = ref(false)
const errors = ref({})
const store = useStore();
const router = useRouter()
const category = computed(() => store.state.currentCategory)
const name = ref(category.value.name)

async function submit(event) {
  loading.value = true;
  const data = {
    name: name.value,
  }
  try {
    let response = await updateAtApi(
      `/categories/${category.value.id}`,
      new JsonBody(data)
    );
    if (response.failed) {
      errors.value = handleErrors(response, false);
    } else {
      store.commit("update_category", { category: category.value, update: response.data })
      successNotification(`Category was updated successfully`);
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
}
async function deleteCategory() {
  try {
    let response = await deleteFromApi(
      `/categories/${category.value.id}`
    );
    if (response.failed) {
      errors.value = handleErrors(response, false);
    } else {
      store.commit("delete_category", category.value)
      successNotification(`Category was deleted successfully`);
      redirect("/categories", router, 5000)
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
}
</script>