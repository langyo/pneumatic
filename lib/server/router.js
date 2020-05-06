import { getServerRouter } from '../lib/actionLoader';

export default (type, payload, routes, configs) => getServerRouter(type)(payload, routes[type], configs);