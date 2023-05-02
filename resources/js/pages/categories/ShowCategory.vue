<template>
  
  <Card class="m-auto mt-3 sm:w-full md:w-8">
    <template #title>
      <h1 class="text-center">{{ category.name }}</h1>
    </template>
    <template #content>
      <table>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>{{category.name}}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #footer>
      <div class="flex justify-content-around">
  <Button v-if="isAdmin" label="Manage" @click="router.push(`${route.path}/update`)"></Button>
      </div>

    </template>
  </Card>
</template>
<script setup>
import { computed } from 'vue';
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import Card from "primevue/card"
import Button from "primevue/button";

const route = useRoute()
const router = useRouter()
const store = useStore()
const category = computed(() => store.state.currentCategory)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const isAdmin = computed(() => store.state.profile && store.state.profile.role === 'admin')
</script>
<style scoped>

table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    max-width: 85%;
    margin:auto;
  }
  .order-row {
    cursor: pointer;
  }
  
  td, th {
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