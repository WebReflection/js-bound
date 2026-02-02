import get from './get.js';

const fr = new FinalizationRegistry(([map, prop]) => map.delete(prop));

class Handler extends Map {
  get(ref, prop) {
    let bound = super.get(prop)?.deref();
    if (!bound) {
      bound = get(ref, prop);
      // weakly hold the bound function to let GC eventually drop it
      super.set(prop, new WeakRef(bound));
      // drop the WeakRef once the bound function is garbage collected
      fr.register(bound, [this, prop]);
    }
    return bound;
  }
}

const proxies = new WeakMap;

const set = ref => {
  const proxy = new Proxy(ref, new Handler);
  proxies.set(ref, proxy);
  return proxy;
};

export default ref => (proxies.get(ref) ?? set(ref));
