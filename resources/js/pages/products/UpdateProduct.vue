<template>
  <div class=" flex justify-content-center align-items-center py-4">
    <div class="surface-card p-4 shadow-2  border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">{{ product.name }}</div>
      </div>

      <form @submit.prevent="submit($event)">
        <fieldset :disabled="loading" class="border-none">
          <label for="name" class="block text-900 font-medium mb-2">Name</label>
          <small class="p-error" id="text-error">{{ errors.name || '' }}</small>
          <InputText id="name" class="w-full mb-3" :class="{ 'p-invalid': errors.name }" @input="errors.name = null"
            name="name" v-model="name" required />
          <label for="price" class="block text-900 font-medium mb-2">Price</label>
          <small class="p-error" id="text-error">{{ errors.price || '' }}</small>
          <InputText id="price" type="number" step="0.01" class="w-full mb-3" :class="{ 'p-invalid': errors.price }"
            @input="errors.price = null" name="price" required v-model="price" />
          <label for="category" class="block text-900 font-medium mb-2">Category</label>
          <small class="p-error" id="text-error">{{ errors.category || '' }}</small>
          <Dropdown id="category" v-model="selectedCategory" :options="categories" class="w-full mb-3"
            :class="{ 'p-invalid': errors.category }" optionLabel="name" @change="errors.category = null"
            placeholder="Select a Category">
          </Dropdown>
          <label for="image" class="block text-900 font-medium mb-2">Change Photo</label>
          <input class="p-inputtext w-full mb-3" id="image" type="file" accept="image/*" name="image"
            @change="image = $event.target.files[0]">
          <div class="flex justify-content-around">
            <Button label="Delete" @click="deleteProduct()" style="background-color: var(--red-700);"></Button>
            <Button :label="loading ? 'Updating' : 'Update'" class="w-9" :loading="loading" type="submit"></Button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex"
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext"
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { updateAtApi, errorNotification, successNotification, handleErrors, getFromApi, FormDataBody, redirect, deleteFromApi } from "@/util";
import router from "../../router/router";

const loading = ref(false)
const errors = ref({})
const store = useStore();
const product = computed(() => store.state.currentProduct)
const categories = computed(() => store.state.categories)
const selectedCategory = ref(product.value.category)
const name = ref(product.value.name)
const price = ref(product.value.price)
const image = ref(null)
onMounted(async () => {
  if (!categories.value.length) {
    try {
      const response = await getFromApi("/categories");
      if (response.failed) handleErrors(response)
      else {
        store.commit("set_categories", response.data)
      }
    } catch (err) {
      errorNotification("Network Error. Refresh to reload data")
    }
  }
  loading.value = false;

});

async function submit(event) {
  loading.value = true;
  const data = {
    name: name.value,
    category: selectedCategory.value.id,
    price: price.value
  }
  if (image.value) data.image = image.value
  try {
    let response = await updateAtApi(
      `/products/${product.value.id}`,
      new FormDataBody(data)
    );
    if (response.failed) {
      errors.value = handleErrors(response, false);
    } else {
      store.commit("update_product", {product: product.value, update: response.data})
      successNotification(`Product was updated successfully`);
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
}
  async function deleteProduct() {
    try {
    let response = await deleteFromApi(
      `/products/${product.value.id}`
    );
    if (response.failed) {
      errors.value = handleErrors(response, false);
    } else {
      store.commit("delete_product", product.value)
      successNotification(`Product was deleted successfully`);
      redirect("/products", router, 5000)
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
  }
</script>