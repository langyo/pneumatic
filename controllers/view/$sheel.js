import {
  dispatch
} from 'nickelcat-action-preset';

export default {
  setDrawerOpen: [
    dispatch('view.drawer', '$view', 'setDrawerState', { open: true })
  ]
};
