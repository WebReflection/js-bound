import cached from './cached.js';
import direct from './direct.js';

export default (ref, cache = false) => (cache ? cached : direct)(ref);
