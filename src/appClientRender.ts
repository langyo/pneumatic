import { createApp } from 'vue';
import { createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

import { generateRouter } from './utils/router';
import { i18n } from './utils/i18n';

import './utils/normalize.scss';
import 'element-plus/dist/index.css';
import App from './app.vue';

(async () => {
  console.log(
    '%c日冕控制终端',
    'font: bold 2em 楷体;padding: 0.5em;margin:4px; line-height: 3em; background: rgba(199, 120, 31, 0.6);color: white;border-radius: 4px;'
  );
  console.log(
    '%c  欢迎，您已接入神州工部前台终端。',
    'font: 1.5em 楷体; background: rgba(199, 120, 31, 0.6);color: white;line-height: 1.5em;padding: 4px;box-decoration-break: clone;border-radius: 4px;margin: 4px;'
  );

  try {
    const app = createApp(App);

    app.use(createPinia());
    app.use(generateRouter(createWebHistory()));
    app.use(i18n);

    const node = document.createElement('div');
    node.id = '__root';
    document.body.appendChild(node);
    app.mount('#__root');
  } catch (e) {
    console.error(e);
    const messages = [
      `${e}`,
      `页面遇到了一些错误，我们对此带来的不便深表歉意。稍后页面将尝试刷新。`,
      `The page has encountered some errors. We apologize for the inconvenience. The page will try to refresh later.`,
      `На странице возникли некоторые ошибки. Приносим извинения за доставленные неудобства. Страница попытается обновиться позже.`,
      `La page a rencontré quelques erreurs. Nous nous excusons pour la gêne occasionnée. La page essaiera de s’actualiser plus tard.`,
      `واجهت الصفحة بعض الأخطاء. نعتذر عن الإزعاج. ستحاول الصفحة التحديث لاحقا.`,
      `La página ha encontrado algunos errores. Pedimos disculpas por las molestias. La página intentará actualizarse más tarde.`
    ];
    document.body.appendChild(
      (() => {
        let node = document.createElement('div');
        for (const message of messages) {
          node.appendChild(
            (() => {
              let node = document.createElement('div');
              node.innerText = message;
              node.style.cssText =
                'font-size: 1em; font-family: sans-serif; text-align: center;';
              return node;
            })()
          );
        }
        node.style.cssText =
          'position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; box-sizing: border-box; padding: 4em; background: black; color: white; opacity: 0.8; display: flex; flex-direction: column; align-items: center; justify-content: center;';
        return node;
      })()
    );
    setTimeout(() => location.reload(), 3000);
  }
})();
