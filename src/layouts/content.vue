<template>
  <article class="border">
    <router-view v-slot="{ Component }">
      <transition
        enter-from-class="border-transform-from"
        enter-active-class="border-transform-active"
        enter-to-class="border-transform-to"
        leave-from-class="border-transform-to"
        leave-active-class="border-transform-active"
        leave-to-class="border-transform-from"
        appear
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </article>
</template>

<style scoped lang="scss">
.border {
  position: fixed;
  top: 0%;
  right: 0%;
  width: 80%;
  height: 100%;
  padding: 16px 32px;
}

.border-transform-active {
  transition: all 0.3s;
}

.border-transform-from {
  opacity: 0;
  pointer-events: none;
}

.border-transform-to {
  opacity: 1;
  pointer-events: auto;
}
</style>
