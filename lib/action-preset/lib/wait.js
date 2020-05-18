import factory from '../../utils/actionFactory';

export default factory({
  creator: [
    { paras: ['number'], func: length => ({ length }) }
  ],
  executor: {
    client: [
      task =>
        async (...args) =>
          await (new Promise(resolve =>
            setTimeout(() => resolve(...args), task.length)
          ))
    ],
    server: [
      task =>
        async (...args) =>
          await (new Promise(resolve =>
            setTimeout(() => resolve(...args), task.length)
          ))
    ],
    native: [
      task =>
        async (...args) =>
          await (new Promise(resolve =>
            setTimeout(() => resolve(...args), task.length)
          ))
    ]
  }
});
