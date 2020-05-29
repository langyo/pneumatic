const { existsSync, readdirSync, statSync } = require('fs');
const { resolve, join } = require('path');

module.exports = function(source) {
  const { parseFilterComponents, parseFilterServices, cwd } = this.query;
  this.cacheable(false);

  let ret = {
    components: [],
    services: []
  };

  const scanDfs = (path, route = '/') => {
    let list = [];
    for (let fileName of readdirSync(path))
      if (statSync(join(path, fileName)).isDirectory())
        list = list.concat(scanDfs(join(path, fileName), `${route}${fileName}/`));
      else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName))
        list.push({ fileName: fileName.slice(0, fileName.lastIndexOf('.')), path: join(path, fileName), route });
    return list;
  }

  if (
    existsSync(resolve(cwd, './components')) && statSync(resolve(cwd, './components')).isDirectory() &&
    existsSync(resolve(cwd, './controllers')) && statSync(resolve(cwd, './controllers')).isDirectory()
  ) {
    let componentsPath = scanDfs(resolve(cwd, './components'));
    let controllersPath = scanDfs(resolve(cwd, './controllers'));

    for (const component of componentsPath) {
      if (parseFilterComponents.indexOf(component.route) >= 0) {
        for (const controller of controllersPath) {
          if (component.route === controller.route && component.fileName === controller.fileName) {
            ret.components.push({
              fileName: component.fileName,
              componentPath: component.path,
              controllerPath: controller.path
            });
            break;
          }
        }
      }
    }
  }
  
  const constStr = '__REQUIRE_PACKAGES__';
  while(source.indexOf(constStr) >= 0) {
    source = 
      source.substr(0, source.indexOf(constStr)) +
      JSON.stringify(ret) +
      source.substr(source.indexOf(constStr) + constStr.length);
  }

  return source;
};
