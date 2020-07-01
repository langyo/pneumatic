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

  setPage: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    })),
    setState(({ initState: { taskKey }}) => ({ showingTask: taskKey })),
    setState(() => ({ drawerOpen: false }))
  ],
  setDrawerState: [
    setState(({ open }) => ({ drawerOpen: open }))
  ],

  loadCreateNewTaskDialog: [
    createModel(payload => ({
      type: 'dialog.createNewTask',
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
