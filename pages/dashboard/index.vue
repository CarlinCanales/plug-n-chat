<script setup>
import { io } from 'socket.io-client';
import Header from "~/components/Header.vue";
import Contact from '../../components/Contact.vue';

const socket = io();
const currentUsers = ref([]);
const me = ref(undefined);

if (socket.connected) {
  onConnect();
}

function onConnect() {
  socket.on('current users', (users) => {
    console.log('users', users);
    currentUsers.value = [ ...users.filter(user => user.id !== socket.id) ];
    console.log('current list of users', currentUsers.value);
  })
  socket.on('new user', (newUser) => {
    console.log('new user added', currentUsers.value);
    const isMe = newUser.id === socket.id;
    if (isMe) {
      me.value = newUser;
    } else {
      currentUsers.value.push(newUser);
    }
  })
  socket.on('user disconnected', (disconnectedUser) => {
    currentUsers.value = currentUsers.value.filter(user => user.id !== disconnectedUser.id);
  })
}

socket.on("connect", onConnect);

function handleClick() {
  window.parent.postMessage({message: 'toggle dashboard', source: 'chatify'}, '*');
}

function createNewSingleChat(props) {
  window.parent.postMessage({message: 'create new single chat', source: 'chatify', props}, '*');
}

</script>
<template>
  <div class="container">
    <Header :handle-click="handleClick" :is-open="isOpen" :title="me?.name"/>
    <Contact v-for="user in currentUsers" :name="user.name" @chat-clicked="createNewSingleChat"/>
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
