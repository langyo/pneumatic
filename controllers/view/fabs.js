import {
  createModel
} from 'nickelcat-action-preset';

export default {
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
  ]
};
