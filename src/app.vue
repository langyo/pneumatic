<template>
  <background />
  <drawer />
  <content />
</template>

<style lang="scss">
*,
html,
body {
  font-family: ENG-CONTENT, CHN-CONTENT;
  color: rgba(255, 255, 255, 0.8);
  margin: 0px;
  box-sizing: border-box;
}

body {
  --color-background-mainly: rgba(40, 32, 23, 0.8);
  --color-background-header: rgba(177, 147, 112, 0.5);
  --color-background-footer: rgba(111, 94, 78, 0.5);

  --color-primary: rgb(199, 120, 31);
  --color-primary-most: rgba(199, 120, 31, 0.8);
  --color-primary-half: rgba(199, 120, 31, 0.5);
  --color-primary-less: rgba(199, 120, 31, 0.2);

  --color-secondary: rgb(129, 108, 24);
  --color-secondary-most: rgba(129, 108, 24, 0.8);
  --color-secondary-half: rgba(129, 108, 24, 0.5);
  --color-secondary-less: rgba(129, 108, 24, 0.2);

  --color-dark: rgb(0, 0, 0);
  --color-dark-most: rgba(0, 0, 0, 0.8);
  --color-dark-half: rgba(0, 0, 0, 0.5);
  --color-dark-less: rgba(0, 0, 0, 0.2);

  --color-light: rgb(255, 255, 255);
  --color-light-most: rgba(255, 255, 255, 0.8);
  --color-light-half: rgba(255, 255, 255, 0.5);
  --color-light-less: rgba(255, 255, 255, 0.2);

  --icon-color: var(--color-light);
}

button,
h1,
h2,
h3,
h4,
h5,
h6,
a {
  font-family: ENG-TITLE, CHN-TITLE;
  outline: none;
  text-decoration: none;
}
</style>

<script lang="ts">
import backgroundVue from './layouts/background.vue';
import contentVue from './layouts/content.vue';
import drawerVue from './layouts/drawer.vue';

export default {
  components: {
    'background': backgroundVue,
    'content': contentVue,
    'drawer': drawerVue
  }
}
</script>
