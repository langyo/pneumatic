import {
  setState,
  setData,
  createModel
} from '../lib/action-preset';

export default {
  $init: () => ({
    drawerOpen: false,
    page: 'overview'
  }),

  setDrawerOpen: [
    setState((payload, { getState }) => ({ drawerOpen: payload }))
  ],
  setPage: [
    setData((payload) => ({ page: payload })),
    createModel(payload => ({
      type: 'editDialog',
      name: payload,
      initState: {}
    }))
  ]
};
