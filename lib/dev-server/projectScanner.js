import { existsSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

export default async (compiler, {
  parseFilterComponents = ['/', 'dialogs'],
  parseFilterServices = ['/'],
  target = 'web'
}) => {
  const asyncCompiler = options => new Promise(resolve => {
    const emitter = compiler(options, '');
    emitter.on('ready', resolve);
  });

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
    existsSync(resolve(process.cwd(), './components')) && statSync(resolve(process.cwd(), './components')).isDirectory() &&
    existsSync(resolve(process.cwd(), './controllers')) && statSync(resolve(process.cwd(), './controllers')).isDirectory()
  ) {
    let componentsPath = scanDfs(resolve(process.cwd(), './components'));
    let controllersPath = scanDfs(resolve(process.cwd(), './controllers'));

    for (const component of componentsPath) {
      if (parseFilterComponents.indexOf(component.route) >= 0) {
        for (const controller of controllersPath) {
          if (component.route === controller.route && component.fileName === controller.fileName) {
            ret.components.push({
              name: component.fileName,
              componentPath: component.path,
              controllerPath: controller.path,
              component: await asyncCompiler({
                entry: component.path,
                target
              }),
              controller: await asyncCompiler({
                entry: controller.path,
                target
              })
            });
            break;
          }
        }
      }
    }
  }

  return ret;
};
