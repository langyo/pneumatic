import React from 'react';
import { renderToString } from 'react-dom/server';
import { buildRootNode } from '../client';
import {
  getInitializer,
  getPreloader
} from '../lib/modelStore';

import { serverLog as log } from '../utils/logger';

const defaultMetaData = [{
  name: "viewport",
  id: "viewport",
  content: "width=device-width, initial-scale=1"
}];

export default pageType => async ({
  ip, path, query, host, charset, protocol, type, cookies
}, {
  staticClientPath,
  pageTitle,
  allowMobileConsole = true,
  rootGuide: {
    rootComponent,
    rootController,
    initState,
    headProcessor = node => ({
      renderCSS: {},
      renderHTML: renderToString(node),
      renderMeta: defaultMetaData
    })
  }
}) => {
  // Initialize the data.
  const renderState = {
    pageType,
    globalState: initState,
    pagePreloadState: getInitializer(pageType)(await getPreloader(pageType)({
      ip, path, query, host, charset, protocol, type, cookies
    }))
  };
  const rootNode = buildRootNode(rootComponent, rootController, renderState);
  let { renderCSS, renderHTML, renderMeta } = headProcessor(rootNode);

  // Fill the blank parameters.
  if (!renderCSS) renderCSS = {};
  if (!renderHTML) renderHTML = renderToString(rootNode);
  if (!renderMeta) renderMeta = defaultMetaData;

  const body = `
<html>
<head>
<title>
    ${
    typeof pageTitle === 'string' && pageTitle ||
    typeof pageTitle === 'object' && (
      pageTitle[pageType] || ''
    )
    }
</title>
<style>
body {
padding: 0px;
margin: 0px;
}
</style>
    ${
    renderMeta.map(obj =>
      Object.keys(obj)
        .map(key => `${key}="${obj[key]}"`)
        .reduce((prev, next) => `${prev} ${next}`, '')
    ).reduce((str, next) => `${str}
<meta ${next} />`, '')
    }
    ${
    Object.keys(renderCSS)
      .map(id => `<style id="${id}">${renderCSS[id]}</style>`)
      .reduce((prev, next) => prev + next)
    }
<head>
<body>
<div id="root">
${renderHTML}
</div>
<script>
window.__NICKELCAT_INIT__ = (${JSON.stringify(renderState)})
</script>
<script src=${staticClientPath}></script>
${allowMobileConsole && `<script>
;(function () {
var src = '//cdn.jsdelivr.net/npm/eruda';
if (!/mobile_dev=true/.test(window.location)) return;
document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
</script>` || ''}
</body>
</html>`;

  return { type: 'text/html', body };
};