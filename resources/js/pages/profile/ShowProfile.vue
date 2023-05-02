<template>
  
  <Card class="m-auto mt-3 sm:w-full md:w-8">
    <template #title>
      <h1 class="text-center">{{ profile.firstname }} {{ profile.lastname }}</h1>
      <img class="h-20rem w-4 m-auto block" :src="`${apiBaseUrl}${profile.image_url}`">
    </template>
    <template #content>
      <table>
        <tbody>
          <tr>
            <th>First Name:</th>
            <td>{{profile.firstname}}</td>
          </tr>
          <tr>
            <th>Last Name:</th>
            <td>{{ profile.lastname }}</td>
          </tr>
          <tr>
            <th>Email Address:</th>
            <td>{{profile.email_address}}</td>
          </tr>
          <tr>
            <th>Country:</th>
            <td>{{profile.country}}</td>
          </tr>
          <tr>
            <th>Phone Number:</th>
            <td>{{formatPhoneNumber(profile.phone_number)}}</td>
          </tr>
          <tr>
            <th>Joined:</th>
            <td>{{new Date(profile.created_at).toDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #footer>
      <div class="flex justify-content-around">
  <Button  class="w-full" label="Edit" @click="router.push(`${route.path}/edit`)"></Button>
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
import { formatPhoneNumber } from '../../util';

const route = useRoute()
const router = useRouter()
const store = useStore()
const profile = computed(state => store.state.profile)
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