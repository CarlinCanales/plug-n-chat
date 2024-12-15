<script setup>
import { io } from 'socket.io-client';
import { onMounted } from "vue";
import Header from "~/components/Header.vue";
import Contact from '../../components/Contact.vue';

const currentUsers = ref([]);
const me = ref(undefined);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  const socket = io(window.location.host, {query: {userId}});
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
      currentUsers.value.delete(disconnectedUser.userId);
    })

    socket.on('latest messages', latestMessages => {
      if (latestMessages.length > 0) {
        latestMessages.forEach(m => {
          const u = currentUsers.value.find(cu => cu.userId === m.friendId || cu.userId === m.userId);
          u && (u.latestMessage = m.message);
        })
      }
    })

    socket.on('received message', (message, fromUserId) => {
      currentUsers.value = [ ...currentUsers.value.map(u => {
        if (u.userId === fromUserId) {
          return {
            ...u,
            latestMessage: message.message
          }
        }
        return u
      }) ];
    })
  }

  socket.on("connect", onConnect);
});

function handleClick() {
  window.parent.postMessage({message: 'toggle dashboard', source: 'chatify'}, '*');
}

function createNewSingleChat(uid, fid) {
  window.parent.postMessage({message: 'create new single chat', source: 'chatify', uid, fid}, '*');
}


</script>
<template>
  <div class="container">
    <Header :handle-click="handleClick" :is-open="isOpen" :title="me?.name"/>
    <Contact v-for="user in currentUsers" :latestMessage="user.latestMessage" :name="user.name" @click="createNewSingleChat(me?.userId, user.userId)"/>
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
