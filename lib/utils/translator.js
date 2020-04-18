import {
  getClientActionTranslator,
  getServerActionTranslator,
  getNativeActionTranslator
} from './actionLoader';

export const clientTranslator = stream => {
  return stream;
};

export const serverTranslator = stream => {
  return stream;
};

export const nativeTranslator = stream => {
  return stream;
};
