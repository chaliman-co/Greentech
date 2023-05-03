<script setup>
import { computed, ref } from 'vue'
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import Toolbar from 'primevue/toolbar';
import Button from "primevue/button"
import Menu from "primevue/menu"
import Sidebar from "primevue/sidebar"
import { deleteProfile } from '../util';
import AdminSidebar from "./AdminSidebar.vue"
import RegularSidebar from './RegularSidebar.vue';
import {requiresAuthentication} from '../util'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const store = useStore()
const router = useRouter()
const profile = computed(() => store.state.profile)
const route = useRoute()
const menu = ref()
const sidebarVisible = ref(false)
const isAdmin = computed(() => profile.value.role === "admin")
const items = ref([{
  items: [
    {
      label: 'Log out',
      icon: 'pi pi-user-minus',
      command: (args) => {
        deleteProfile()
        if (requiresAuthentication(route)) router.push({name: "Login"})
      }
    },
    {
      label: 'Checkout',
      icon: 'pi pi-thumbs-up',
      command: (args) => {
        router.push({name: "Checkout"})
      }
    },
  ]
}])
const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <Sidebar v-model:visible="sidebarVisible">
          <div class="text-center" v-if="profile">
            <img  :src="`${apiBaseUrl}${profile.image_url}`" class="sidebar-image" alt="">
            <h2>
              <div>{{ profile.firstname }}</div>
              <div>{{profile.lastname}}</div>
            </h2>
            <AdminSidebar v-if="isAdmin"></AdminSidebar>
            <RegularSidebar v-else-if="profile"></RegularSidebar>
          </div>
            <div v-else class=" text-5xl">Log in to add items to your shopping cart!</div>
        </Sidebar>
  <Toolbar>
    <template #start>
      <Button icon="pi pi-bars" @click="sidebarVisible = !sidebarVisible" class="menu-button"></Button>
    </template>
    <template #end>
      <img v-if="profile" :src="`${apiBaseUrl}${profile.image_url}`" class="profile-pic right-cut" alt="">
      <router-link to="/login" v-if="!profile && route.name != 'Login'"><Button label="login"
          icon="pi pi-user pi-user-minus" class="menu-button"></Button></router-link>
      <div>
        <Button type="button" v-if="profile" :label="`${profile.firstname}&#x25BE;`" icon="pi pi-user"
          @click="toggle" class="menu-button left-cut"></Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"></Menu>
      </div>
    </template>
  </Toolbar>
</template>

<style scoped>
.menu-button {
  border: 1px solid var(--surface-600);
  background-color: white;
  color: black;
}

.menu-button:hover {
  color: green;
}
.profile-pic {
  height: 46px;
border-radius: 50%;
width: 50px;
}
.right-cut {
border-top-right-radius: 0;
border-bottom-right-radius: 0;
}
.left-cut {
  border-top-left-radius: 0;
border-bottom-left-radius: 0;
}
.sidebar-image {
  border-radius: 50%;
width: 100px;
height: 100px;
margin: auto;
display: block;
}
</style>
