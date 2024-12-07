<script setup>
import { io } from "socket.io-client";
import Header from "~/components/Header.vue";

const socket = io();
const isConnected = ref(false);
const transport = ref("N/A");
const id = ref(0);
const messages = ref([]);
const inputRef = ref(null);

onMounted(() => {
  id.value = getParam('id');
})

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;
  console.log('id', socket.id);

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });
  socket.on('received-message', (message) => {
    console.log('received message', message);
    messages.value.push({received: true, message});
  })
}

function onDisconnect() {
  isConnected.value = false;
  transport.value = "N/A";
}

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);


function getParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function handleClick() {
  window.parent.postMessage({message: 'toggle chat', source: 'chatify', id: id.value}, '*');
}

function handleClose() {
  window.parent.postMessage({message: 'close chat', source: 'chatify', id: id.value}, '*');
}

function sendMessage() {
  console.log('seding message');
  messages.value.push({received: false, message: inputRef.value.value});
  socket.emit('message', inputRef.value.value);
}

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});

</script>
<template>
  <section>
    <Header :handle-close="handleClose" use-close :handle-click="handleClick" title="Single Chat"/>
    <div>
      <ul>
        <li :class="{'left': message.received, 'right': !message.received}" v-for="message in messages">
          <div>{{ message.message }}</div>
        </li>
      </ul>
    </div>
    <footer>
      <div>
        <textarea ref="inputRef"/>
      </div>
      <div @click="sendMessage">
        <Icon size="2rem" name="material-symbols:send"/>
      </div>
    </footer>
  </section>
</template>
<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  height: 100%;

  & > :first-child,
  & > :last-child {
    flex: 0 0 auto;
  }

  & > :not(:first-child, :last-child) {
    flex-grow: 1;
  }
}

ul {
  padding: 0;
  margin: 0;
}

li {
  padding: 1rem;
  display: flex;
  position: relative;


  &.divider {
    justify-content: center;

    &:after {
      content: ' ';
      z-index: -1;
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      top: 50%;
      background: linear-gradient(90deg, white 10%, black 10%, black 90%, white 90%);
    }

    span {
      padding: .1rem .4rem;
      background: white;
    }
  }

  div {
    display: inline-block;
    padding: 1rem;
    border-radius: .4rem;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.3);
  }

  &.left {
    div {
      background-color: rgba(gray, .8);
    }
  }

  &.right {
    justify-content: flex-end;

    div {
      background: rgba(green, .5)
    }
  }

}

footer {
  padding: 1rem;
  border-top: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-between;

  textarea {
    padding: .2rem;
  }

  div {
    &:last-child:hover {
      cursor: pointer;
    }
  }
}
</style>
