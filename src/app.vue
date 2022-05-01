<template>
  <el-container>
    <el-header>
      <div class="logo">
        {{ 'PNEUMATIC' }}
      </div>
      <el-tabs
        class="tags"
        v-model="selectedTab"
        type="card"
        @tab-remove="handleTabsEdit"
      >
        <el-tab-pane :label="$t('router.overview')" name="root" />
        <el-tab-pane
          v-for="{ name, title } of tabs"
          :key="name"
          :label="title"
          :name="name"
          closable
        />
      </el-tabs>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu>
          <el-menu-item index="overview">
            {{ $t('router.overview') }}
          </el-menu-item>
          <el-menu-item index="dashboardSettings">
            {{ $t('router.dashboardSettings') }}
          </el-menu-item>
          <el-menu-item-group :title="$t('router.router')">
            <el-menu-item index="siteMap">
              {{ $t('router.siteMap') }}
            </el-menu-item>
            <el-menu-item index="staticFileManager">
              {{ $t('router.staticFileManager') }}
            </el-menu-item>
            <el-menu-item index="routeRule">
              {{ $t('router.routeRule') }}
            </el-menu-item>
            <el-menu-item index="auditRule">
              {{ $t('router.auditRule') }}
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group :title="$t('router.service')">
            <el-menu-item index="moduleManager">
              {{ $t('router.moduleManager') }}
            </el-menu-item>
            <el-menu-item index="dataSourceManager">
              {{ $t('router.dataSourceManager') }}
            </el-menu-item>
            <el-menu-item index="aggregateManager">
              {{ $t('router.aggregateManager') }}
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view v-slot="{ Component }">
          <transition
            enter-from-class="fade-transform-from"
            enter-active-class="fade-transform-active"
            enter-to-class="fade-transform-to"
            leave-from-class="fade-transform-to"
            leave-active-class="fade-transform-active"
            leave-to-class="fade-transform-from"
            appear
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
$asideWidth: 300px;

.logo {
  position: fixed;
  top: 0%;
  left: 0%;
  width: $asideWidth;
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

.tags {
  position: fixed;
  top: 0%;
  right: 0%;
  width: calc(100% - $asideWidth);
  height: 64px;
  padding: 8px;
  user-select: none;
}

.fade-transform-active {
  transition: all 0.3s;
}

.fade-transform-from {
  opacity: 0;
  pointer-events: none;
}

.fade-transform-to {
  opacity: 1;
  pointer-events: auto;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t: $t } = useI18n();

function jumpTo(name: string) {
  router.push({ name });
}

const selectedTab = ref('root');
const tabs = ref([
  { name: '114', title: '114' },
  { name: '514', title: '514' },
]);

const handleTabsEdit = (targetName: string) => {
  if (targetName === selectedTab.value) {
    tabs.value.forEach((tab, index) => {
      if (tab.name === targetName) {
        selectedTab.value =
          tabs[index + 1]?.name || tabs[index - 1]?.name || 'root';
      }
    });
  }
  tabs.value = tabs.value.filter(({ name }) => name !== targetName);
};
</script>

<script lang="ts">
import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElTabs,
  ElTabPane,
} from 'element-plus/es';

export default {
  components: {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElMenuItemGroup,
    ElTabs,
    ElTabPane,
  },
};
</script>
