import {
  setState
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
    setState((payload, { getState }) => ({ page: payload }))
  ]
};
