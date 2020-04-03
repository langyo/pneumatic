import {
  getGlobalState,
  setGlobalState,
  getState,
  setState,
  getModelList,
  createModel,
  destoryModel,
  evaluateModelAction
} from './globalState';
import { getActionEvaluator } from './actionCreator';
import log from './logger';

export default ({
  test,
  tasks,
  path
}, {
  modelType,
  modelID
}) => (async payload => {
  if (!test) test = (() => true);

  if (!test(payload, getState(modelType, modelID), getGlobalState())) {
    log(`The action ${path} has been skiped.`);
    return payload;
  }
  log('Get payload', payload);
  log('Get tasks', tasks);
  log(`The action ${path} will be executed`);
  for (let i = 0; i < tasks.length; ++i) {
    log('Middle process', tasks[i].type, 'at', i, ', the total length is', tasks.length);
    if (!Array.isArray(tasks[i])) {
      try {
        payload = await getActionEvaluator(tasks[i].type)(tasks[i].func)(payload, {
          setState: state => setState(modelType, modelID, state),
          getState: () => getState(modelType, modelID),
          setGlobalState,
          getGlobalState,
          getModelList,
          getOtherModelState: getState,
          createModel,
          destoryModel,
          evaluateModelAction: (async (...args) => await evaluateModelAction(...args))
        }, {
          modelType,
          modelID
        });
        log(`The action ${path} has runned to step ${i}, the payload is`, payload);
      } catch (e) {
        log(`The action ${path} was failed to execute, because`, e);
      }
    } else {
      payload = await createTasks({
        test: tasks[i][0],
        tasks: tasks[i].slice(1),
        path: `${path}[${i}]`
      }, {
        modelType,
        modelID
      })(payload);
      log(`The action ${path}[${i}] has been executed.`);
    }
  }
  return payload;
});

