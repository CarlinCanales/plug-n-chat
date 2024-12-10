<script setup>
import { io } from 'socket.io-client';
import { onMounted } from "vue";
import Header from "~/components/Header.vue";
import Contact from '../../components/Contact.vue';

const currentUsers = ref(new Map());
const me = ref(undefined);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const socket = io(window.location.host, {query: {id: userId}});
  if (socket.connected) {
    onConnect();
  }

  function onConnect() {
    socket.on('current users', (users) => {
      currentUsers.value = [ ...users.filter(user => user.userId !== userId) ];
    })
    socket.on('new user', (newUser) => {
      const isMe = newUser.userId === userId;
      if (isMe) {
        me.value = newUser;
        return
      }

      if (!currentUsers.value.find(u => u.userId === newUser.userId)) {
        currentUsers.value.push(newUser);
      }
    })
    socket.on('user disconnected', (disconnectedUser) => {
      currentUsers.value = currentUsers.value.filter(user => user.id !== disconnectedUser.id);
    })
  }

  socket.on("connect", onConnect);
});

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
