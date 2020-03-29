import client, {
  connect,
  register,
  loadActionModel,
  buildRootNode
} from './client/index';
import server from './server/index';

export default {
  ...client,
  server
};

export {
  connect,
  register,
  loadActionModel,
  buildRootNode
};
export {
  server
};

