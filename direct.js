import get from './get.js';

const handler = { get };

export default ref => new Proxy(ref, handler);
