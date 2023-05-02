
<template>
  <DataTable v-if="loading" :value="skeletonOrders">
    <Column header="Date">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Placed By">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="No. Of Items">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Total Price">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Status">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
  </DataTable>
  <DataTable @row-select="router.push(`/admin/orders/${$event.data.id}`)" v-if="!loading && orders.data.length > 0"
    :value="orders.data" selectionMode="single" dataKey="id">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-xl text-900 font-bold">Orders</span>
      </div>
    </template>
    <Column header="Date Created">
      <template #body="slotProps">
        {{ new Date(slotProps.data.created_at).toDateString() }}
      </template>
    </Column>
    <Column header="PlacedBy">
      <template #body="slotProps">
        {{ slotProps.data.user.firstname + " " + slotProps.data.user.lastname }}
      </template>
    </Column>
    <Column header="No. Of Items">
      <template #body="slotProps">
        {{ slotProps.data.items.reduce((total, cartItem) => total + cartItem.quantity, 0) }}
      </template>
    </Column>
    <Column header="Total Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.items.reduce((total, cartItem) => total + cartItem.quantity *
          cartItem.product.price, 0)) }}
      </template>
    </Column>
    <Column field="status" header="Status"></Column>
    <template #footer> In total you have {{ orders.total }} orders. </template>
  </DataTable>
  <div v-if="!loading && !orders.data.length" class="text-center text-3xl font-bold">No orders found.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import { useStore } from 'vuex';
import { errorNotification, getFromApi, handleErrors, formatCurrency } from '../../../util';

const router = useRouter()
const store = useStore()
const profile = computed(() => store.state.profile)
const orders = computed(() => store.state.orders)
const loading = ref(true)
const skeletonOrders = [];
for (let i = 0; i < 5; i++) skeletonOrders.push({})
onMounted(async () => {
  if (!orders.value.total) {
    try {
      const response = await getFromApi(`/orders`);
      if (response.failed) handleErrors(response)
      else {
        store.commit("set_orders", response.data)
      }
    } catch (err) {
      errorNotification("Network Error. Refresh to reload data")
    }
  }
  loading.value = false

});


</script>
<style scoped>
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