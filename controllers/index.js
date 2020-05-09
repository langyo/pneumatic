import {
  setState,
  togglePage,
  createModel
} from '../lib/action-preset';

export default {
  $init: ({ taskKey }) => ({
    drawerOpen: false,
    showingTask: taskKey
  }),

  setDrawerOpen: [
    setState(payload => ({ drawerOpen: payload }))
  ],
  setPage: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    })),
    setState(({ initState: { taskKey }}) => ({ showingTask: taskKey }))
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
  ],
  loadAboutDialog: [
    createModel(payload => ({
      type: 'aboutDialog',
      initState: {}
    }))
  ]
};
