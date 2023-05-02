
<template>
  <DataTable @row-select="router.push(`/products/${$event.data.product.id}`)" v-if="!loading && cart.length > 0"
    :value="cart" selectionMode="single" dataKey="id">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-xl text-900 font-bold">Products In Cart</span>
      </div>
    </template>
    <Column field="product.name" header="Name"></Column>
    <Column field="product.category.name" header="Category"></Column>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${apiBaseUrl}${slotProps.data.product.image_url}`" class="w-6rem shadow-2 border-round" height="80" />
      </template>
    </Column>
    <Column field="product.price" header="Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.product.price) }}
      </template>
    </Column>
    <Column field="quantity" header="Quantity"></Column>
    <Column header="Total">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.product.price * slotProps.data.quantity) }}
      </template>
    </Column>
    <ColumnGroup type="footer">
        <Row>
            <Column footer="Total:" :colspan="4" footerStyle="text-align:right" />
            <Column :footer="cart.reduce((total, cartItem) => total + cartItem.quantity, 0) " />
            <Column :footer="formatCurrency(cart.reduce((total, cartItem) => total + cartItem.quantity * cartItem.product.price, 0)) " />
        </Row>
    </ColumnGroup>
    <template #footer>
      In total there are {{ cart.length }} products in your cart.
    </template>
  </DataTable>
  <div v-if="!cart.length" class="text-center text-3xl font-bold">No products in cart.</div>
<div v-if="cart.length" class="flex justify-content-around">
  <Button label="Clear" @click="clearCart()" style="background-color: var(--red-700);"></Button>
  <Button :label="loading ? 'Placing...' : 'Place Order'" class="w-9" :loading="loading" @click="placeOrder"></Button>
</div>
</template>

<script setup>
import {ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import ColumnGroup from "primevue/columngroup"
import Button from "primevue/button"
import Row from "primevue/row"
import { useStore } from 'vuex';
import { successNotification, errorNotification, postToApi, JsonBody, handleErrors } from '../util';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const store = useStore()
const cart = computed(() => store.state.cart)

const loading = ref(false)
const errors = ref({})
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
function clearCart() {
  store.commit("clear_cart");
  successNotification("Cart cleared Successfully");
}
async function placeOrder(event) {
  loading.value = true;
  try {
    let response = await postToApi(
      `/orders`,
      new JsonBody(cart.value.map(item => ({quantity: item.quantity, product_id: item.product.id})))
    );
    if (response.failed) {
      errors.value = handleErrors(response, false);
    } else {
      store.commit("clear_cart")
      successNotification(`Order was placed successfully`);
      router.push("/orders")
    }
  } catch (err) {
    errorNotification("Network Error");
  } finally {
    loading.value = false;
  }
}
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