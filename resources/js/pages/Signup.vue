<template>
  <div class=" flex justify-content-center align-items-center py-4">
    <div class="surface-card p-4 shadow-2  border-round w-full lg:w-6">
    <div class="text-center mb-5">
        <i  class="mb-3 pi pi-user text-4xl"></i>
        <div class="text-900 text-3xl font-medium mb-3">Register</div>
        <span class="text-600 font-medium line-height-3">Already have an account?</span>
        <router-link to="Login" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Log In Here!</router-link>
    </div>

    <form @submit.prevent="submit($event)">
      <fieldset :disabled="loading" class="border-none">
        <label for="firstname" class="block text-900 font-medium mb-2">First Name</label>
        <small class="p-error" id="text-error">{{ errors.firstname || '' }}</small>
        <InputText id="firstname" class="w-full mb-3" :class="{ 'p-invalid': errors.firstname }" @input="errors.firstname = null" v-model="firstname" name="firstname" required/>
        <label for="lastname" class="block text-900 font-medium mb-2">Last Name</label>
        <small class="p-error" id="text-error">{{ errors.lastname || '' }}</small>
        <InputText id="lastname" class="w-full mb-3" :class="{ 'p-invalid': errors.lastname }" @input="errors.lastname = null" v-model="lastname" name="lastname" required/>
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <small class="p-error" id="text-error">{{ errors.email_address || '' }}</small>
        <InputText id="email" type="email" class="w-full mb-3" :class="{ 'p-invalid': errors.email_address }" @input="errors.email_address = null" v-model="email_address" name="email_address" required/>
        <label for="country" class="block text-900 font-medium mb-2">Country</label>
        <small class="p-error" id="text-error">{{ errors.country || '' }}</small>
        <Dropdown id="country" v-model="selectedCountry" :options="countries" :class="{'p-invalid': errors.country}" optionLabel="name" @change="errors.country = null" placeholder="Select a Country"
                class="w-full mb-3">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label" :src="`${countryFlagsUrl}/${slotProps.value.code}.svg`" width="35">
                        <div class="ml-3">{{ slotProps.value.name }}</div>
                      </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :alt="slotProps.option.label" :src="`${countryFlagsUrl}/${slotProps.option.code}.svg`"
                            style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Dropdown>
        <label for="password" class="block text-900 font-medium mb-2">Password</label>
        <small class="p-error" id="text-error">{{ errors.password || '' }}</small>
        <InputText id="password" ref="passwordEl" type="password" class="w-full mb-3" :class="{ 'p-invalid': errors.password }" @input="errors.password = null, passwordCheck()" @paste="passwordCheck()" v-model="password" name="password" required/>
        <label for="confirm-password" class="block text-900 font-medium mb-2">Confirm Password</label>
        <small class="p-error" id="text-error">{{ errors.password || '' }}</small>
        <InputText id="confirm-password" 
          @input="passwordCheck(), errors.password = null"
          @paste="passwordCheck" ref="confirmPasswordEl" type="password" class="w-full mb-3" :class="{ 'p-invalid': errors.password }" v-model="confirmPassword" name="password" required/>

        <label for="phone_number" class="block text-900 font-medium mb-2">Phone Number</label>
        <small class="p-error" id="text-error">{{ errors.phone_number || '' }}</small>
        <tel-input
        id="phone_number"
          error-message="please enter a valid phone number"
          required
          @input="setPhoneNumber"
          class="mb-5"
        />
        <label for="image" class="block text-900 font-medium mb-2">Photo</label>
        <input class="p-inputtext w-full mb-3" id="image" type="file" accept="image/*" name="image"  @change="image = $event.target.files[0]">
        <Button :label="loading ? 'Signing Up' : 'Sign Up'" class="w-full" :loading="loading" type="submit"></Button>
      </fieldset>
    </form>
</div>
  </div>

</template>
<script setup>
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import { postToApi, errorNotification, successNotification, handleErrors, getProfile, FormDataBody, redirect } from "@/util";
import { ref } from "vue";
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import telInput from "@/components/tel-input.vue";
import Dropdown from "primevue/dropdown";
import countries from "@/assets/countries";
const  countryFlagsUrl = 'https://raw.githubusercontent.com/lipis/flag-icons/1734912defc091ebaa46d46fdacd564425e643c0/flags/1x1'
const loading = ref(false)
const errors = ref({})
const store = useStore()
const router = useRouter()
const firstname = ref("")
const lastname = ref("")
const email_address = ref("")
const password = ref("")
const confirmPassword = ref("")
const phone_number = ref()
const image = ref(null)
const confirmPasswordEl = ref()
const passwordEl = ref()
const selectedCountry = ref(countries[0])
async function submit(event) {
      loading.value = true;
      const data = {
            firstname: firstname.value,
            lastname: lastname.value,
            country: selectedCountry.value.name,
            phone_number: {
              digits: phone_number.value.digits,
              region: phone_number.value.region
            },
            email_address: email_address.value,
            password: password.value,
          }
          if (image.value) data.image = image.value
      try {
        let response = await postToApi(
          "/users",
          new FormDataBody(data)
        );
        if (response.failed) {
          errors.value = handleErrors(response, false);
        } else {
          store.commit("delete_profile")
          successNotification(`Registration Successful`);
          redirect("Login", router, 5000);
        }
      } catch (err) {
        errorNotification("Network Error");
      } finally {
        loading.value = false;
      }
  }
  
  function passwordCheck() {
      if (!password) return;
      confirmPassword.value !== password.value
        ? confirmPasswordEl.value.$el.setCustomValidity("Passwords do not match")
        : confirmPasswordEl.value.$el.setCustomValidity("");
    }
    function setPhoneNumber({ digits, region, isValid }) {
      if (isValid) phone_number.value = { digits, region };
      else phone_number.value = null;
    }
</script>