<template>
  <div class=" flex justify-content-center align-items-center py-4">
    <div class="surface-card p-4 shadow-2  border-round w-full lg:w-6">
    <div class="text-center mb-5">
        <i  class="mb-3 pi pi-user text-4xl"></i>
        <div class="text-900 text-3xl font-medium mb-3">Log In</div>
        <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <router-link to="Signup" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create Now!</router-link>
    </div>

    <form @submit.prevent="submit($event)">
      <fieldset :disabled="loading" class="border-none">
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <small class="p-error" id="text-error">{{ errors.email_address || '' }}</small>
        <InputText id="email" type="email" class="w-full mb-3" :class="{ 'p-invalid': errors.email_address }" @input="errors.email_address = null" name="email_address" required/>
        <label for="password" class="block text-900 font-medium mb-2">Password</label>
        <small class="p-error" id="text-error">{{ errors.password || '' }}</small>
        <InputText id="password" type="password" class="w-full mb-3" :class="{ 'p-invalid': errors.password }" @input="errors.password = null" name="password" required/>

        <Button :label="loading ? 'Signing In' : 'Sign In'" class="w-full" :loading="loading" type="submit"></Button>
      </fieldset>
    </form>
</div>
  </div>

</template>
<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { postToApi, errorNotification, successNotification, handleErrors, getProfile, JsonBody, redirect } from "@/util";
import { ref } from "vue";
import {useStore} from "vuex"
import {useRouter} from "vue-router"
const loading = ref(false)
const errors = ref({})
const store = useStore();
const router = useRouter()
async function submit(event) {
      loading.value = true;
      try {
        let response = await postToApi(
          "/auth",
          new JsonBody(event.target)
        );
        if (response.failed) {
          errors.value = handleErrors(response, false);
        } else {
          const token = response.data.token;
          sessionStorage.setItem("api_token", token);
          const profile = await getProfile();
          store.commit("set_profile", profile);
          successNotification(`Logged in as ${profile.firstname} ${profile.lastname}`);
          redirect("/", router, 5000);
        }
      } catch (err) {
        errorNotification("Network Error");
      } finally {
        loading.value = false;
      }
  }
</script>