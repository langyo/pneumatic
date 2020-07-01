import {
  togglePage
} from 'nickelcat-action-preset';

export default {
  setTab: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    }))
  ]
};
