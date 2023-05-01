<template>
  <div class="surface-section flex justify-content-center align-items-center px-4 py-8 md:px-6 lg:px-8">
    <div class="text-700 text-center">
      <div class="text-blue-600 font-bold mb-3">
      </div>
      <div class="text-900 font-bold text-5xl mb-3">Not Found!</div>
      <div class="text-700 text-2xl mb-5">It seems you have lost your way</div>
      <router-link to="/">
        <Button label="Go To Home Page" 
          class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import Button  from 'primevue/button';
</script>
<style>
.surface-section {
  height: 100vh;
}

</style>