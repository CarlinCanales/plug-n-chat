<script setup>
import Header from "~/components/Header.vue";
import Contact from '../../components/Contact.vue';

function handleClick() {
  window.parent.postMessage({message: 'toggle dashboard', source: 'chatify'}, '*');
}

function createNewSingleChat(props) {
  window.parent.postMessage({message: 'create new single chat', source: 'chatify', props}, '*');
}
</script>
<template>
  <div class="container">
    <Header :handle-click="handleClick" :is-open="isOpen" title="Messaging"/>
    <Contact name="Carlin Canales" @chat-clicked="createNewSingleChat"/>
    <Contact name="Beatriz Canales" @chat-clicked="createNewSingleChat"/>
    <Contact name="Caleb Canales" @chat-clicked="createNewSingleChat"/>
    <Contact name="Avery Canales" @chat-clicked="createNewSingleChat"/>
    <Contact name="Noah Canales" @chat-clicked="createNewSingleChat"/>
    <Contact name="Zoey Canales" @chat-clicked="createNewSingleChat"/>
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
