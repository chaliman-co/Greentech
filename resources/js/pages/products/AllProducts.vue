
<template>
  <DataTable v-if="loading" :value="skeletonProducts">
    <Column header="name">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Category">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Image">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Price">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
  </DataTable>
  <DataTable @row-select="router.push(`/products/${$event.data.id}`)" v-if="!loading && products.data.length > 0"
    :value="products.data" selectionMode="single" dataKey="id">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-xl text-900 font-bold">Products</span>
      </div>
    </template>
    <Column field="name" header="Name"></Column>
    <Column field="category.name" header="Category"></Column>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${apiBaseUrl}${slotProps.data.image_url}`" class="w-6rem shadow-2 border-round" height="80" />
      </template>
    </Column>
    <Column field="price" header="Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.price) }}
      </template>
    </Column>
    <template #footer> In total there are {{ products.total }} products. </template>
  </DataTable>
  <div v-if="!loading && !products.data.length" class="text-center text-3xl font-bold">No products found.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import { useStore } from 'vuex';
import { errorNotification, getFromApi, handleErrors, formatCurrency } from '../../util';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const store = useStore()
const products = computed(() => store.state.products)
const loading = ref(true)
const skeletonProducts = [];
for (let i = 0; i < 5; i++) skeletonProducts.push({ })
onMounted(async () => {
  if (!products.value.data.length) {
    try {
      const response = await getFromApi("/products");
      if (response.failed) handleErrors(response)
      else {
        store.commit("set_products", response.data)
      }
    } catch (err) {
      errorNotification("Network Error. Refresh to reload data")
    } finally {
      loading.value = false;
    }
  }
  loading.value = false

});
</script>
<style>
.p-datatable-table {
  margin: auto;
  min-width: 60% !important;
}

@media screen and (max-width: 800px) {
  .p-datatable-table {
    min-width: 90% !important;
  }
}
</style>