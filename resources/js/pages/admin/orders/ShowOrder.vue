<template>
  
  <Card class="m-auto mt-3 sm:w-full md:w-8">
    <template #title>
      <h1 class="text-center">Order Details</h1>
      <p class="text-center">Status: {{ order.status }}</p>
      <p class="font-normal text-center">Created on {{ new Date(order.created_at).toDateString()  }}</p>
    </template>
    <template #content>
      <DataTable :value="order.items"  dataKey="id">
    <template #header>
        <p class="text-xl text-900 font-bold text-center">Items</p>
    </template>
    <Column header="Name">
      <template #body="slotProps">
        {{ slotProps.data.product.name}}
      </template>
    </Column>
    <Column header=" ">
      <template #body="slotProps">
        <img :src="`${apiBaseUrl}${slotProps.data.product.image_url}`" class="w-6rem shadow-2 border-round" height="80" />
      </template>
    </Column>
    <Column header="Quantity">
      <template #body="slotProps">
        {{ slotProps.data.quantity }}
      </template>
    </Column>
    <Column header="Unit Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.product.price) }}
      </template>
    </Column>
    <Column header="Total Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.quantity * slotProps.data.product.price, 0) }}
      </template>
    </Column>
    <ColumnGroup type="footer">
        <Row>
            <Column footer="Total:" :colspan="2" footerStyle="text-align:left" />
            <Column :footer="order.items.reduce((total, item) => total + item.quantity, 0) " />
            <Column :footer="formatCurrency(order.items.reduce((total, item) => total + item.quantity * item.product.price, 0)) " :colspan="2" footerStyle="text-align:right"/>
        </Row>
    </ColumnGroup>
  </DataTable>
    </template>
    <template #footer>
      <div class="flex justify-content-center">
        <Dropdown v-model="selectedStatus" :options="statusOptions"  placeholder="Select status" class="mr-3" style="width:200px" />
        <Button @click="update()" :loading="loading" :label="loading? 'Updating' : 'Update'"  title="Update" ></Button>
      </div>

    </template>
  </Card>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import Card from "primevue/card"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import ColumnGroup from "primevue/columngroup"
import Button from "primevue/button"
import Row from "primevue/row"
import Dropdown from "primevue/dropdown";
import { errorNotification, formatCurrency, successNotification, updateAtApi, handleErrors, JsonBody } from '../../../util';

const route = useRoute()
const router = useRouter()
const store = useStore()
const order = computed(() => store.state.currentOrder)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const loading = ref()
const selectedStatus = ref()
const statusOptions = ref([
    'pending',
    'processing', 
   'delivered',
    'declined'
]);
onMounted(() => selectedStatus.value = order.value.status)
async function update() {
  loading.value = true;
  const data = {
    status: selectedStatus.value
  }
  try {
    let response = await updateAtApi(
      `/orders/${order.value.id}`,
      new JsonBody(data)
    );
    if (response.failed) {
      errorNotification(response.errorDetails.status[0])
    } else {
      store.commit("update_order", {order: order.value, update: response.data})
      successNotification(`Order was cancelled successfully`);
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
}
</script>