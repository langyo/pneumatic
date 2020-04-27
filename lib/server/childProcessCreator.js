import EventEmitter from 'events';
import { fork } from 'child_process';
import { generate } from 'shortid';

export const parentCreator = link => {
  let process = fork(link);
  let emitter = new EventEmitter();


  const watch = () => {
    process.on('message', ({ payload, id, type }) => {
      if (type === 'normal') {
        emitter.emit('message', { payload, id })
      } else if (type === 'init') {
        emitter.emit('init');
      }
    });
  };
  watch();

  return {
    send: async payload => {
      return await new Promise(resolve => {
        const myId = generate();
        const fn = ({ payload, id }) => {
          if (myId === id) {
            resolve(payload);
            emitter.off('message', fn);
          }
        };
        emitter.on('message', fn);
        process.send({ payload, id: myId, type: 'normal' });
      });
    },
    restart: () => {
      process.kill();
      const fn = () => {
        emitter.off('init', fn);
      };
      emitter.once('init', fn);
      process = fork(link);
      watch();
      process.send({ type: 'init' });
    }
  };
};

export const childCreator = processor =>
  process.on('message', ({ payload, id, type }) => {
    if (type === 'normal') {
      processor(payload).then(payload => process.send({
        payload, id, type
      }));
    } else if (type === 'init') {
      process.send({ type });
    }
  });
