import { renderToString } from 'react-dom/server';

export default pageType => ({
  ip, path, query, host, charset, protocol, type, cookies
}, {
  staticClientPath,
  pageTitle,
  allowMobileConsole = true
}) => {
  const body = `
<html>
<head>
<title>${
  typeof pageTitle === 'string' && pageTitle ||
  typeof pageTitle === 'object' && (
    pageTitle[pageType] || ''
  )
}</title>
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