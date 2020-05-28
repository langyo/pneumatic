import {
  setState,
  fetch,
  deal
} from '../lib/action-preset';

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