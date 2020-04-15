import {
  setState,
  setData,
  destoryModel,
  wait
} from '../../lib/action-preset';

export default {
  $init: () => ({
    isOpen: true,
    isFetching: false
  }),

  submit: [
    setState({ isFetching: true }),
    wait(1000),
    setData(({ }) => ({
    })),
    setState({ isFetching: false, isOpen: false }),
    wait(1000),
    destoryModel((payload, { modelType, modelID }) => ({ type: modelType, id: modelID }))
  ],

  destory: [
    setState({ isOpen: false }),
    wait(1000),
    destoryModel((payload, { modelType, modelID }) => ({ type: modelType, id: modelID }))
  ]
};