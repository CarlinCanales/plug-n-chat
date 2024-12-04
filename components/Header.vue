<script setup>
import Avatar from "~/components/Avatar.vue";

const {title, isOpen} = defineProps({
  title: String,
  isOpen: Boolean,
  handleClick: Function
});

</script>
<template>
  <header @click="handleClick">
    <div>
      <Avatar/>
    </div>
    <div>
      {{ title }}
    </div>
    <div>
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
