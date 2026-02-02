# js-bound

A utility to simplify binding methods to references.

```js
import bound from 'https://esm.run/js-bound';

const map = new Map;

// one-off direct bindings
const { get, set } = bound(map);

const reference = { method() { return this } };

// repeated cached (always same) bindings
const { method } = bound(reference, true);

console.assert(method === bound(reference).method);
```

### Exports

  * `js-bound/direct` to bind directly without *cache* orchestration: each binding is unique, ideal for one-off operations via `bound(ref:unknown)` signature
  * `js-bound/cached` to bind using a *weakly referenced cache* that avoids leaks while granting each bound method is created only once via `bound(ref:unknown)` signature
  * `js-bound` to bind with or without cache, includes both *direct* and *cached* variants via its `bound(ref:unknown, cache?:boolean)` signature

Each export returns a *Proxy* of the *reference* object with a specialized *get* trap that simply *binds* the retrieved method.

In the *cached* variant, both the *Proxy* and each bound methods are always the same but each bound method can garbage collect itself if not used anymore, keeping the amount of needed *RAM* overtime minimal for long running applications.
