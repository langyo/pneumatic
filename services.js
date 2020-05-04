import {
  connect,
  initRoutes,
  getRoutes
} from './lib/server';
import { loadActionModel } from './lib';

import presetActionPackage from './lib/action-preset';
loadActionModel(presetActionPackage);

import OverviewPage from './components/overviewPage';
import overviewPageCtx from './controllers/overviewPage';
connect(OverviewPage, overviewPageCtx, 'overview')

import FetchPage from './components/fetchPage';
import fetchPageCtx from './controllers/fetchPage';
connect(FetchPage, fetchPageCtx, 'fetch');

import ParsePage from './components/parsePage';
import parsePageCtx from './controllers/parsePage';
connect(ParsePage, parsePageCtx, 'parse');

import StatusPage from './components/statusPage';
import statusPageCtx from './controllers/statusPage';
connect(StatusPage, statusPageCtx, 'status');

import CreateNewTaskDialog from './components/dialogs/createNewTask';
import createNewTaskDialogCtx from './controllers/dialogs/createNewTask';
connect(CreateNewTaskDialog, createNewTaskDialogCtx, 'createNewTaskDialog');

import FetchConfigDialog from './components/dialogs/fetchConfig';
import fetchConfigDialogCtx from './controllers/dialogs/fetchConfig';
connect(FetchConfigDialog, fetchConfigDialogCtx, 'fetchConfigDialog');

import ParseConfigDialog from './components/dialogs/parseConfig';
import parseConfigDialogCtx from './controllers/dialogs/parseConfig';
connect(ParseConfigDialog, parseConfigDialogCtx, 'parseConfigDialog');

import AboutDialog from './components/dialogs/about';
import aboutDialogCtx from './controllers/dialogs/about';
connect(AboutDialog, aboutDialogCtx, 'aboutDialog');

initRoutes();

import { childCreator } from './lib/server';

childCreator(({
  type,
  payload: { ip, path, query, host, charset, protocol, type, staticClientPath }
}) => {
  // TODO 暂时放在这里，马上迁移
  const type = 'text/html';
  const body = `
<html>
<head>
<title>Demo Page</title>
<style>
body {
padding: 0px;
margin: 0px;
}
</style>
<meta name="viewport" id="viewport" content="width=device-width, initial-scale=1" />
<style>${
    ''
    }</style>
<head>
<body>
<div id="root">${
    ''
    }</div>
<script>${
    ''
    }</script>
<script src=${staticClientPath}></script>
<script>
;(function () {
var src = '//cdn.jsdelivr.net/npm/eruda';
if (!/mobile_dev=true/.test(window.location)) return;
document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
</script>
</body>
</html>`;

  return { type, body };
});
