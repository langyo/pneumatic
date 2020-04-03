import { generate } from 'shortid';

import createStream from './createStream';
import {
  getModelList as getModelListOnStore,
  getInitializer,
  getStream
} from './modelStore';
import deepMerge from './deepMerge';

let globalState = {};
let modelState = getModelListOnStore().reduce((obj, key) => ({ ...obj, [key]: {}}), {});
let listeners = [];

const updateListener = () => {
  listeners.forEach(setState => setState(() => ({
    modelState,
    globalState
  })));
} 

export const getAllState = () => ({ modelState, globalState });

export const getState = (modelType, modelID) => {
  // Check the container.
  if (!(modelState[modelType])) modelState[modelType] = {};
  
  if (!(modelState[modelType][modelID])) throw new Error(`The model ${modelType}[${modelID}] is missing.`);

  return modelState[modelType][modelID];
}; 

export const setState = (modelType, modelID, state) => {
  // Check the container.
  if (!(modelState[modelType])) modelState[modelType] = {};
  
  if (!(modelState[modelType][modelID])) throw new Error(`The model ${modelType}[${modelID}] is missing.`);
  
  modelState[modelType][modelID] = deepMerge(modelState[modelType][modelID], state);
  updateListener();
  console.log('Check', modelState)
}; 

export const getGlobalState = () => globalState;

export const setGlobalState = state => {
  globalState = deepMerge(globalState, state);
  updateListener();
};

export const getModelList = modelType => Object.keys(modelState).reduce(
  (obj, key) => ({
    ...obj,
    [key]: Object.keys(modelState[key])
  }), {}
);

export const createModel = (modelType, initState, id = generate()) => {
  modelState = deepMerge(modelState, {
    [modelType]: {
      [id]: getInitializer(modelType)(initState)
    }
  });
  updateListener();
  return id;
};

export const destoryModel = (modelType, modelID) => {
  modelState = dedepMerge(modelState, {
    [modelType]: {
      [modelID]: null
    }
  });
  updateListener();
};

export const evaluateModelAction = async (modelType, modelID, actionName, payload) => {
  modelState = deepMerge(modelState, {
    [modelType]: {
      [modelID]: await createStream({
        tasks: getStream(modelType)[actionName],
        path: actionName
      }, {
        modelType,
        modelID
      })(payload)
    }
  });
  updateListener();
};

export const registerListener = setState => listeners.push(setState);

