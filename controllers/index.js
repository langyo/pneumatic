import {
  setState,
  togglePage,
  createModel
} from 'nickelcat-action-preset';

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
      type: 'dialog.createNewTask',
      initState: {}
    }))
  ],
  loadFetchDialog: [
    createModel(payload => ({
      type: 'dialog.fetchConfig',
      initState: {}
    }))
  ],
  loadParseDialog: [
    createModel(payload => ({
      type: 'dialog.parseConfig',
      initState: {}
    }))
  ],
  loadAboutDialog: [
    createModel(payload => ({
      type: 'dialog.about',
      initState: {}
    }))
  ]
};
