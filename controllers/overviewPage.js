import {
  setState,
  fetch,
  deal
} from 'nickelcat-action-preset';

export default {
  $init: () => ({
    testValue: 1
  }),

  onTestFetch: [
    fetch(
      '/api/test',
      ({ testValue }) => ({ testValue }),
      [
        deal(async ({ testValue }) => ({ testValue: testValue + 1 }))
      ]
    ).catch([
      setState((error) => ({ testValue: 'fail' }))
    ]),
    setState(({ testValue }) => ({ testValue }))
  ]
};