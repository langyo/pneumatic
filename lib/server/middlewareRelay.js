export default (sendFunc, libType = 'koa', staticClientPath = './spa.js') => {
  switch (libType) {
    case 'koa':
      return async (ctx, next) => {
        ctx.response.type = 'text/html';
        ctx.response.body = `
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
        await next();
      };
    default:
      throw new Error(`Unsupported library type: ${libType}`);
  }
}