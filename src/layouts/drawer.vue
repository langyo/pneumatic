<template>
  <div class="logo">PNEUMATIC</div>
  <div class="border">
    <fluent-tree-view class="outside">
      <fluent-tree-item
        v-for="name of ['overview', 'dashboardSettings']"
        @click="jumpTo(name)"
      >
        {{ $t(`drawer.${name}`) }}
      </fluent-tree-item>
      <fluent-tree-item expanded>
        {{ $t('drawer.router.router') }}
        <fluent-tree-item
          v-for="name of [
            'siteMap',
            'staticFileManager',
            'routeRule',
            'auditRule',
          ]"
          @click="jumpTo(name)"
        >
          {{ $t(`drawer.router.${name}`) }}
        </fluent-tree-item>
      </fluent-tree-item>
      <fluent-tree-item expanded>
        {{ $t('drawer.service.service') }}
        <fluent-tree-item
          v-for="name of [
            'moduleManager',
            'dataSourceManager',
            'aggregateManager',
          ]"
          @click="jumpTo(name)"
        >
          {{ $t(`drawer.service.${name}`) }}
        </fluent-tree-item>
      </fluent-tree-item>
      <fluent-tree-item expanded>
        {{ $t('drawer.module.module') }}
        <fluent-tree-item disabled>
          <p class="disabled-text">
            {{ $t('drawer.module.noModuleAvailable') }}
          </p>
        </fluent-tree-item>
      </fluent-tree-item>
    </fluent-tree-view>
  </div>
</template>

<style scoped lang="scss">
.logo {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 20%;
  height: 64px;
  font-size: 2em;
  font-family: cursive;
  font-weight: bold;
  text-shadow: 2px 2px 2px lightcyan;
  color: lightskyblue;
  line-height: 64px;
  text-align: center;
  user-select: none;
}

.border {
  position: fixed;
  top: 64px;
  left: 0%;
  width: 20%;
  height: 100%;
  padding: 8px;
  overflow: hidden auto;
}

.outside {
  width: 100%;
  height: 100%;
  user-select: none;
}

.disabled-text {
  color: gray;
  font-style: italic;
}
</style>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t: $t } = useI18n();

function jumpTo(name: string) {
  router.push({ name });
}
</script>
