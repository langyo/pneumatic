import {
  setState
} from '../lib/action-preset';

export default {
  $preload: async ({ query: { taskKey } }) => ({
    taskKey
  }),

  $init: ({ taskKey }) => ({
    taskKey
  }),
  
};