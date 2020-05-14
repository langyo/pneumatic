import { generalControllerStreamLog as log } from '../utils/logger';

export default (context, actionEvaluator) => {
  const createTasks = ({
    tasks,
    path
  }, extraArgs = {}) => (async payload => {
    const tags = tasks[0];

    if (tags.test && (!tags(payload, context))) {
      log({ tasks, path, payload, status: 'skipped' });
      return payload;
    }
    if (tags.loop && tags.loop.strickClock) {
      if (tags.loop.strickClock <= 10) throw new Error('You used strict timing mode, but the interval you set is too short.');
      setTimeout(tags.loop.timeOut, () => new Promise(() => createTasks({
        tags, tasks, path
      }, extraArgs)(payload)));
    }

    log({ tasks, path, payload, status: 'begin' });
    for (let i = 1; i < tasks.length; ++i) {
      if (!Array.isArray(tasks[i])) {
        try {
          payload = await actionEvaluator(tasks[i])(payload, {
            ...context,
            ...extraArgs
          });
          log({ tasks, path, payload, status: 'success', step: i });
        } catch (e) {
          log({ tasks, path, payload, status: 'fail', step: i, extraErrorInfo: e });
        }
      } else {
        payload = await createTasks({
          tasks: tasks[i],
          path: `${path}[${i}]`
        }, extraArgs)(payload);
        log({ tasks, path, payload, status: 'success', step: i });
      }
    }

    if (tags.loop && !tags.loop.strickClock) {
      setTimeout(tags.loop.timeOut, () => new Promise(() => createTasks({
        tags, tasks, path
      }, extraArgs)(payload)));
    }

    return payload;
  });

  return createTasks;
};