<script setup>
import Avatar from '../components/Avatar.vue';
</script>
<template>
  <article>
    <aside>
      <Avatar/>
    </aside>
    <section>
      <div>
        <span>Beatriz Canales</span>
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
