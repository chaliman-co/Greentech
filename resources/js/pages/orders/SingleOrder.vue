<template>
  <div v-if="!order" class="m-auto mt-3 sm:w-full md:w-8">
    <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
    <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
    <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
    <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
    <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
  </div>
  <router-view v-if="order"></router-view>
</template>
<script setup>
import Skeleton from "primevue/skeleton"
import { ref, onMounted, computed } from 'vue';
import { useStore } from "vuex"
import { useRoute } from "vue-router"
import { errorNotification, getFromApi, handleErrors } from '../../util';
const route = useRoute()
const store = useStore()
const order = computed(() => store.state.currentOwnOrder)
const loading = ref(false)
onMounted(async () => {
  if (!order.value || order.value.id !== route.params.id) {
    const orderFromStore = store.state.ownOrders.data.find(order => order.id === Number(route.params.id))
    if (orderFromStore) store.commit("set_current_own_order", orderFromStore)
    else try {alert("not found")
      const response = await getFromApi(`/orders/${route.params.id}`);
      if (response.failed) handleErrors(response)
      else {
        store.commit("set_current_own_order", response.data)
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
</style>