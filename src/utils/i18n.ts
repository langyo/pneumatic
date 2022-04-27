import { createI18n } from 'vue-i18n';
import mergeObject from 'deepmerge';

import globalPack from '@res/lang/global.json5';
import langZhCN from '@res/lang/zhCN.json5';
import langEnUS from '@res/lang/enUS.json5';

export const i18n = createI18n({
  locale: (typeof navigator !== 'undefined' && navigator.language) || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': mergeObject(globalPack, langZhCN),
    'en-US': mergeObject(globalPack, langEnUS)
  }
});
