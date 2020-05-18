import factory from '../../utils/actionFactory';

export default factory({
  creator: [
    { paras: ['function'], func: func => ({ func }) }
  ],
  executor: {
    client: [
      task =>
        async (...args) =>
          await task.func(...args)
    ],
    server: [
      task =>
        async (...args) =>
          await task.func(...args)
    ],
    native: [
      task =>
        async (...args) =>
          await task.func(...args)
    ]
  }
});
