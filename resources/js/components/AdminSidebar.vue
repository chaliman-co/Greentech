
<template>
  <div class="card">
    <Accordion :multiple="true" class="w-full">
      <AccordionTab header="Profile">
        <router-link to="/profile">
          <Button label="View My Profile" icon="pi pi-building" class="menu-button"></Button>
        </router-link>
      </AccordionTab>
      <AccordionTab header="Users">
        <router-link to="/users"><Button label="View All" icon="pi pi-user" class="menu-button"></Button></router-link>
      </AccordionTab>
      <AccordionTab header="Products">
        <router-link to="/products">
          <Button label="View All" icon="pi pi-building" class="menu-button"></Button>
        </router-link>
        <router-link to="/add_product">
          <Button label="Add New Product" icon="pi pi-plus" class="menu-button"></Button>
        </router-link>
      </AccordionTab>
      <AccordionTab header="Categories">
        <router-link to="/categories">
          <Button label="View All" icon="pi pi-user" class="menu-button"></Button>
        </router-link>
        <router-link to="add_category">
          <Button label="Add New Category" icon="pi pi-plus" class="menu-button"></Button>
        </router-link>
      </AccordionTab>
      <AccordionTab header="Orders">
        <router-link to="/orders">
          <Button label="View My Orders" icon="pi pi-building" class="menu-button"></Button>
        </router-link>
      </AccordionTab>
    </Accordion>
    <router-link to="/Checkout">
      <Button label="Checkout" class="menu-button mt-5"></Button>
    </router-link>
  </div>
</template>

<script setup>
import TieredMenu from "primevue/tieredmenu"
import Accordion from "primevue/accordion"
import AccordionTab from "primevue/accordiontab"
import Button from "primevue/button";


</script>
<style scoped>
.p-accordion-content {
  padding: 13px;
}

.menu-button {
  background: none;
  color: inherit;
  width: 100%;
  margin-bottom: 10px;
}
</style>