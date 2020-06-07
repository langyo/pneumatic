import {
  setState,
  destoryModel,
  wait
} from 'nickelcat-action-preset';

export default {
  $init: () => ({
    isOpen: true
  }),

  destory: [
    setState({ isOpen: false }),
    wait(1000),
    destoryModel((payload, { modelType, modelID }) => ({ type: modelType, id: modelID }))
  ]
};