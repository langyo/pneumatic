import { watch } from 'chokidar';
import { resolve } from 'path';
import EventEmitter from 'events';

export default ({
  workDirPath,
  aggregate = 1000,
  ignored = resolve(workDirPath, './node_modules/')
}) => {
  const emitter = new EventEmitter();

  const fileScan = () => ({});

  let changedDuringDelay = false;
  let delayWaiting = false;
  const delayUpdate = () => {
    delayWaiting = true;
    setTimeout(() => {
      if (changedDuringDelay) {
        changedDuringDelay = false;
        delayUpdate();
      } else {
        delayWaiting = false;
        emitter.emit('update', fileScan());
      }
    }, aggregate);
  };

  watch(workDirPath, {
    ignored
  }).on('all', (event, path) => {
    if (delayWaiting) changedDuringDelay = true;
    else delayUpdate();
  });

  return emitter;
};

