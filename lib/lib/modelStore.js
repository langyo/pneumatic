let components = {};
let initializer = {};
let preloader = {};
let originControllerStreams = {};

let clientControllerStreams = {};
let serverControllerStreams = {};
let nativeControllerStreams = {};

import {
  clientTranslator,
  serverTranslator,
  nativeTranslator
} from './translator';

export const storageModel = ({ modelType, component, controllers }) => {
  components[modelType] = component;
  originControllerStreams[modelType] = controllers;
  
  if (controllers.$init) initializer[modelType] = controllers.$init;
  if (controllers.$preload) preloader[modelType] = controllers.$preload;

  clientControllerStreams[modelType] = clientTranslator(controllers);
  serverControllerStreams[modelType] = serverTranslator(controllers);
  nativeControllerStreams[modelType] = nativeTranslator(controllers);
};

export const _storageViewController = controllers => {
  if (controllers.$init) initializer.$view = controllers.$init;
  if (controllers.$preload) preloader.$view = controllers.$preload;
  originControllerStreams.$view = Object.keys(controllers).filter(key => key !== '$init' && key !== '$preload').reduce(
    (obj, key) => ({ ...obj, [key]: controllers[key] }), {}
  );
}

export const loadComponent = type => components[type];

export const getModelList = () => Object.keys(components);

export const getInitializer = type => initializer[type] || (init => init);

export const getPreloader = type => preloader[type] || (async init => init);

export const getClientStream = type => clientControllerStreams[type] || {};

export const getServerStream = type => serverControllerStreams[type] || {};

export const getNativeStream = type => nativeControllerStreams[type] || {};