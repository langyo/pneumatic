export default {
  creator: (path, translator, stream, options = {}) => {
    if (typeof path !== 'string') throw new Error('You must provide a string as the path!');
    if (typeof translator !== 'function') throw new Error('You must provide a function as the translator!');
    if (!Array.isArray(stream)) throw new Error('You must provide an array as the stream!');
    if (typeof options !== 'object') throw new Error('You must provide an object as the options!');
    return { path, translator, stream, options };
  },
  translator: {
    client: ({ path, options, translator }) => [{ path, options, translator, $$type: 'fetch' }],
    serverRouter: ({ path, stream, options }, { childStreamTranslator }) => [
      { path, $$static: childStreamTranslator(stream), options, $$type: 'fetch' }
    ]
  },
  executor: {
    client: ({ path, options, translator }) => async (payload, {
      setState,
      getState,
      setGlobalState,
      getGlobalState,
      getModelList,
      createModel,
      destoryModel,
      evaluateModelAction,
      modelType,
      modelID
    }) => {
      const ret = await fetch(path, {
        method: options.method || 'POST',
        headers: options.headers || {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(translator(payload, { getState, getGlobalState, getModelList, modelType, modelID })),
        credentials: 'same-origin'
      });
      return ret.json();
    },
    // TODO It will be renamed to serverRouter in the future.
    server: ({ path }) => ({ execChildStream }) => ({
      http: {
        [path]: async payload => ({
          type: 'application/json',
          body: JSON.stringify(await execChildStream()(payload.body, payload))
        })
      }
    })
  }
};
