<template>
  <background />
  <drawer />
  <content />
</template>

<script lang="ts">
import {
  provideFluentDesignSystem,
  allComponents,
} from "@fluentui/web-components";

provideFluentDesignSystem().register(allComponents);

import backgroundVue from "./layouts/background.vue";
import contentVue from "./layouts/content.vue";
import drawerVue from "./layouts/drawer.vue";

export default {
  components: {
    background: backgroundVue,
    content: contentVue,
    drawer: drawerVue,
  },
};
</script>
