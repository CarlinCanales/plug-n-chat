<script setup>
import { ref } from 'vue';
import Header from "~/components/Header.vue";
import Contact from '../../components/Contact.vue';

const isOpen = ref(false);

function handleClick() {
  isOpen.value = !isOpen.value;
  window.parent.postMessage({message: 'toggle dashboard', source: 'chatify'}, '*');
}
</script>
<template>
  <div class="container">
    <Header :handle-click="handleClick" :is-open="isOpen" title="Messaging"/>
    <Contact/>
    <Contact/>
    <Contact/>
    <Contact/>
  </div>
</template>
<style>
html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
