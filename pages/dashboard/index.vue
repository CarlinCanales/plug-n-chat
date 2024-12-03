<script setup>
import { ref } from 'vue';
import Avatar from '../../components/Avatar.vue';
import Contact from '../../components/Contact.vue';

const isOpen = ref(false);

function handleClick() {
  isOpen.value = !isOpen.value;
  window.parent.postMessage({message: 'toggle dashboard', source: 'chatify'}, '*');
}
</script>
<template>
  <div class="container">
    <header @click="handleClick">
      <div>
        <Avatar/>
      </div>
      <div>
        Messaging
      </div>
      <div>
        <Icon v-if="isOpen" name="line-md:chevron-down"/>
        <Icon v-if="!isOpen" name="line-md:chevron-up"/>
      </div>
    </header>
    <Contact/>
    <Contact/>
    <Contact/>
    <Contact/>
  </div>
</template>
<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
header {
  cursor: pointer;
  display: grid;
  height: 3rem;
  grid-template-columns: auto auto 1fr;

  border-bottom: 1px solid black;

  & > * {
    padding: 0 .5rem;
    align-content: center;
  }

  & > :last-child {
    justify-self: flex-end;
  }
}
</style>
