import {
  setState,
  setData,
  togglePage,
  createModel
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
  ],
  setTab: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    }))
  ],

  loadCreateNewTaskDialog: [
    createModel(payload => ({
      type: 'createNewTaskDialog',
      initState: {}
    }))
  ],
  loadFetchDialog: [
    createModel(payload => ({
      type: 'fetchConfigDialog',
      initState: {}
    }))
  ],
  loadParseDialog: [
    createModel(payload => ({
      type: 'parseConfigDialog',
      initState: {}
    }))
  ]
};
