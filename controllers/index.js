import {
  setState,
  setData,
  togglePage
} from '../lib/action-preset';

export default {
  $init: () => ({
    drawerOpen: false
  }),

  setDrawerOpen: [
    setState(payload => ({ drawerOpen: payload }))
  ],
  setPage: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    })),
    setData(({ initState }) => ({ showingTask: initState.taskKey }))
  ]
};
