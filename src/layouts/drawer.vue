<template>
  <div class="border">
    <fluent-tree-view class="outside">
      <fluent-tree-item selected>
        {{ $t('drawer.overview') }}
      </fluent-tree-item>
      <fluent-tree-item>
        {{ $t('drawer.dashboardSettings') }}
      </fluent-tree-item>
      <fluent-tree-item expanded>
        {{ $t('drawer.router.router') }}
        <fluent-tree-item>{{ $t('drawer.router.siteMap') }}</fluent-tree-item>
        <fluent-tree-item>{{
          $t('drawer.router.staticFileManage')
        }}</fluent-tree-item>
        <fluent-tree-item>{{ $t('drawer.router.routeRule') }}</fluent-tree-item>
        <fluent-tree-item>{{ $t('drawer.router.auditRule') }}</fluent-tree-item>
      </fluent-tree-item>
      <fluent-tree-item expanded>
        {{ $t('drawer.service.service') }}
        <fluent-tree-item>{{
          $t('drawer.service.moduleManage')
        }}</fluent-tree-item>
        <fluent-tree-item>{{
          $t('drawer.service.dataSourceManage')
        }}</fluent-tree-item>
        <fluent-tree-item>{{
          $t('drawer.service.aggregateManage')
        }}</fluent-tree-item>
      </fluent-tree-item>
      <fluent-tree-item expanded>
        {{ $t('drawer.module.module') }}
        <fluent-tree-item>
          <p class="disabled-text">
            {{ $t('drawer.module.noModuleAvailable') }}
          </p>
        </fluent-tree-item>
      </fluent-tree-item>
    </fluent-tree-view>
  </div>
</template>

<style scoped lang="scss">
.border {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 20%;
  height: 100%;
  padding: 8px;
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
</script>
