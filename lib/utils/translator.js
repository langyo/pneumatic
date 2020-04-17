import { getActions } from './actionLoader';

const actions = getActions();

export const clientTranslator = stream => {
  return stream;
};

export const serverTranslator = stream => {
  return stream;
};

export const nativeTranslator = stream => {
  return stream;
};
