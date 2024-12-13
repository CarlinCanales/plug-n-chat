<script setup>
import Avatar from '../components/Avatar.vue';

const {name} = defineProps({
  name: String,
  latestMessage: String
});
</script>
<template>
  <article>
    <aside>
      <Avatar/>
    </aside>
    <section>
      <div>
        <span>{{ name }}</span>
        <time>Yesterday</time>
      </div>
      <p>
        {{ latestMessage || 'No new messages.' }}
      </p>
    </section>
  </article>
</template>
<style lang="scss" scoped>
article {
  display: grid;
  grid-template-columns: 3rem 1fr;
  padding: 1rem .5rem 0 0;
  cursor: pointer;

  p {
    margin: 0;
  }

  &:hover {
    background-color: rgba(0, 0, 0, .1)
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

    & > *:first-child {
      display: flex;
      justify-content: space-between;
    }
  }

  time {
    color: rgba(0, 0, 0, 0.4);
  }
}
</style>
