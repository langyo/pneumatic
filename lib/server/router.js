import { getServerRouter } from '../lib/actionLoader';

export default (type, payload, routes, configs) => {
  const ret = getServerRouter(type)(payload, routes[type], configs);
  if (!ret) return { successFlag: false, payload: {} };
  else return { successFlag: true, payload: ret }
};