import log from '../lib/logger';

export default (context, actionEvaluator) => {
  const createTasks = ({
    test,
    tasks,
    path
  }, extraArgs) => (async payload => {
    if (!test) test = (() => true);

    if (!test(payload, context)) {
      log(`The action ${path} has been skiped.`);
      return payload;
    }
    log('Get payload', payload);
    log('Get tasks', tasks);
    log(`The action ${path} will be executed`);
    for (let i = 0; i < tasks.length; ++i) {
      log('Middle process', tasks[i].$$type, 'at', i + 1, '/', tasks.length);
      if (!Array.isArray(tasks[i])) {
        try {
          payload = await actionEvaluator(tasks[i])(payload, {
            ...context,
            ...extraArgs
          });
          log(`The action ${path} has runned to step ${i + 1}, the payload is`, payload);
        } catch (e) {
          log(`The action ${path} was failed to execute, because`, e);
        }
      } else {
        payload = await createTasks({
          test: tasks[i][0],
          tasks: tasks[i].slice(1),
          path: `${path}[${i}]`
        }, extraArgs)(payload);
        log(`The action ${path} has runned to step ${i + 1}, the payload is`, payload);
      }
    }
    return payload;
  });

  return createTasks;
};