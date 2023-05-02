<template>
  <div v-if="!product" class="m-auto mt-3 sm:w-full md:w-8">
    <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
    <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
    <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
    <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
    <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
  </div>
  <router-view v-if="product"></router-view>
</template>
<script setup>
import Skeleton from "primevue/skeleton"
import { ref, onMounted, computed } from 'vue';
import { useStore } from "vuex"
import { useRoute } from "vue-router"
import { errorNotification, getFromApi, handleErrors } from '../../util';
const route = useRoute()
const store = useStore()
const product = computed(() => store.state.currentProduct)
const loading = ref(false)
onMounted(async () => {
  if (!product.value || product.value.id !== route.params.id) {
    const productFromStore = store.state.products.data.find(prod => prod.id === Number(route.params.id))
    if (productFromStore) store.commit("set_current_product", productFromStore)
    else try {
      const response = await getFromApi(`/products/${route.params.id}`);
      if (response.failed) handleErrors(response)
      else {
        store.commit("set_current_product", response.data)
      }
    } catch (err) {
      errorNotification("Network Error. Refresh to reload data")
    }
    loading.value = false;
  }

})
</script>
<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  max-width: 85%;
  margin: auto;
}

.order-row {
  cursor: pointer;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

@media screen and (min-width: 1000px) {
  table {
    max-width: 70%;
  }
}
</style>