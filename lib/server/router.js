import { getServerRouter } from '../lib/actionLoader';

export default (type, payload, routes) => getServerRouter(type)(payload, routes[type]);