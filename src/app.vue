<template>
  <background />
  <drawer />
  <content />
</template>

<script lang="ts">
import {
  provideFluentDesignSystem,
  allComponents,
} from '@fluentui/web-components';

provideFluentDesignSystem().register(allComponents);

import BackgroundVue from '@/layouts/background.vue';
import DrawerVue from '@/layouts/drawer.vue';
import ContentVue from '@/layouts/content.vue';

export default {
  components: {
    background: BackgroundVue,
    drawer: DrawerVue,
    content: ContentVue,
  },
};
</script>
