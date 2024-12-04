<script setup>
import { ref } from 'vue';
import Avatar from "~/components/Avatar.vue";

const {title, handleClick, useClose = false, handleClose} = defineProps({
  title: String,
  useClose: Boolean,
  handleClick: Function,
  handleClose: Function
});

const isOpen = ref(false);

function toggleAndPerformAction() {
  isOpen.value = !isOpen.value;
  handleClick();
}

function closeChat(e) {
  e.stopPropagation();
  handleClose();
}

</script>
<template>
  <header @click="toggleAndPerformAction">
    <div>
      <Avatar/>
    </div>
    <div>
      {{ title }}
    </div>
    <div v-if="useClose">
      <Icon @click="closeChat" name="material-symbols:close"/>
    </div>
    <div v-if="!useClose">
      <Icon v-if="isOpen" name="line-md:chevron-down"/>
      <Icon v-if="!isOpen" name="line-md:chevron-up"/>
    </div>
  </header>
</template>
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
