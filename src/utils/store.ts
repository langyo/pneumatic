import { defineStore } from 'pinia';

export const useStoreForLayout = defineStore('layout', {
  state: () => ({
    isRouting: false,
    isLegacyBrowser: false,
    isMobile: false,
  }),

  actions: {
    async toggleRouting(val: boolean) {
      this.isRouting = val;
    },
    async setIsLegacyBrowser(val: boolean) {
      this.isLegacyBrowser = val;
    },
    async setIsMobile(val: boolean) {
      this.isMobile = val;
    },
  },
});
