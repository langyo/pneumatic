import {
  togglePage
} from 'nickelcat-action-preset';

export default {
  $init: ({ taskKey }) => ({
    showingTask: taskKey
  }),

  setTab: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    }))
  ]
};
