<script setup>
import Avatar from '../components/Avatar.vue';

const FAUX_ID = Math.random();
const EMIT_CHAT_CLICKED = 'chatClicked';

const {name} = defineProps({
  name: String
})

const emits = defineEmits([ EMIT_CHAT_CLICKED ]);

function handleChatClick(e) {
  e.stopPropagation();
  emits(EMIT_CHAT_CLICKED, {id: FAUX_ID, name});
}

</script>
<template>
  <article @click="handleChatClick">
    <aside>
      <Avatar/>
    </aside>
    <section>
      <div>
        <span>{{ name }}</span>
        <time>Yesterday</time>
      </div>
      <div>
        Lorem Ipsum is simply dummy text of the.
      </div>
    </section>
  </article>
</template>
<style lang="scss" scoped>
article {
  display: grid;
  grid-template-columns: 3rem 1fr;
  padding: 1rem .5rem 0 0;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, .1)
  }
}

aside {
  padding: .5rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

section > *:first-child {
  display: flex;
  justify-content: space-between;
}

time {
  color: rgba(0, 0, 0, 0.4);
}
</style>
