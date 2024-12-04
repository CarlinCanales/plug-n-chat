<script setup>
import Header from "~/components/Header.vue";
</script>
<template>
  <section>
    <Header title="Single Chat"/>
    <div>
      <ul>
        <li class="divider">
          <span>Yesterday</span>
        </li>
        <li class="left">
          <div>Message from friend</div>
        </li>
        <li class="right">
          <div>Response to friend</div>
        </li>
        <li class="divider">
          <span>Today</span>
        </li>
        <li class="left">
          <div>Message from friend</div>
        </li>
        <li class="right">
          <div>Response to friend</div>
        </li>
      </ul>
    </div>
    <footer>
      <div>
        <textarea/>
      </div>
      <div>
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
}
</style>
