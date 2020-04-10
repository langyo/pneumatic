import {
  setState,
  togglePage
} from '../lib/action-preset';

export default {
  $init: () => ({
    drawerOpen: false,
    page: 'overview'
  }),

  setDrawerOpen: [
    setState(payload => ({ drawerOpen: payload }))
  ],
  setPage: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    }))
  ]
};
