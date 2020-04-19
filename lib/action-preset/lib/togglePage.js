export default {
  creator: (typeOrFunc, initState = {}) =>
    typeof typeOrFunc === 'function' ?
      { func: typeOrFunc } :
      { type: typeOrFunc, initState },
  executor: {
    client: task => async (payload, {
      setState,
      getState,
      setGlobalState,
      getGlobalState,
      getModelList,
      createModel,
      destoryModel,
      evaluateModelAction
    }, {
      modelType,
      modelID
    }) => {
      if (task.func) {
        let ret = task.func(payload, {
          state: getState(modelType, modelID),
          getGlobalState,
          getModelList,
          getState,
          modelType,
          modelID
        });
        if (getGlobalState().$page) destoryModel(getGlobalState().$page, '$page');
        createModel(ret.type, ret.initState, '$page');
        setGlobalState({ $page: ret.type });
      } else {
        if (getGlobalState().$page) destoryModel(getGlobalState().$page, '$page');
        createModel(task.type, task.initState, '$page');
        setGlobalState({ $page: task.type });
      }
      return payload;
    }
  }
};
