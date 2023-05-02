
<template>
  <DataTable v-if="loading" :value="skeletonUsers">
    <Column  header="First Name">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Last Name">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Image">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Country">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Phone Number">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column header="Email Address">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
  </DataTable>
  <DataTable  v-if="!loading && users.data.length > 0"
    @row-select="router.push(`/users/${$event.data.id}`)"
    selectionMode="single" 
    dataKey="id"
    :value="users.data" >
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-xl text-900 font-bold">Users</span>
      </div>
    </template>
    <Column  header="Name">
      <template #body="slotProps">
        <div>{{ `${slotProps.data.firstname} ${slotProps.data.lastname}` }}</div>
      </template>
    </Column>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${apiBaseUrl}${slotProps.data.image_url}`" class="w-6rem shadow-2 border-round" height="80" />
      </template>
    </Column>
    <Column field="country" header="Country"></Column>
    <Column header="Phone Number">
      <template #body="slotProps">
        {{formatPhoneNumber(slotProps.data.phone_number)}}
      </template>
    </Column>
    <Column field="email_address" header="Email Address"></Column>
    <template #footer> In total there are {{ users.total }} users. </template>
  </DataTable>
  <div v-if="!loading && !users.data.length" class="text-center text-3xl font-bold">No users found.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { errorNotification, getFromApi, handleErrors, formatPhoneNumber } from '../../util';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const store = useStore()
const router = useRouter()
const users = computed(() => store.state.users)
const loading = ref(true)
const skeletonUsers = [];
for (let i = 0; i < 5; i++) skeletonUsers.push({ })
onMounted(async () => {
  if (!users.value.data.length) {
    try {
      const response = await getFromApi("/users");
      if (response.failed) handleErrors(response)
      else {console.log()
        store.commit("set_users", response.data)
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
  min-width: 90% !important;
}

@media screen and (max-width: 800px) {
  .p-datatable-table {
    min-width: 90% !important;
  }
}
</style>