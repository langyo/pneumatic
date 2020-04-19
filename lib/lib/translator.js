import {
  getClientActionTranslator,
  getServerActionTranslator,
  getNativeActionTranslator
} from './actionLoader';

export const clientTranslator = streams => {
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;

    ret[streamName] = [];
    for (let action of streams[streamName]) {
      ret[streamName] = [...ret[streamName], ...getClientActionTranslator(action.$$type)(action)];
    }
  }

  ret.$init = streams.$init;
  return ret;
};

export const serverTranslator = streams => {
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;

    ret[streamName] = [];
    for (let action of streams[streamName]) {
      ret[streamName] = [...ret[streamName], ...getServerActionTranslator(action.$$type)(action)];
    }
  }

  ret.$preload = streams.$preload;
  return ret;
};

export const nativeTranslator = streams => {
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;

    ret[streamName] = [];
    for (let action of streams[streamName]) {
      ret[streamName] = [...ret[streamName], ...getNativeActionTranslator(action.$$type)(action)];
    }
  }

  ret.$preload = streams.$preload;
  return ret;
};
