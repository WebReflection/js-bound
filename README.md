# js-bound

[![build status](https://github.com/WebReflection/js-bound/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/js-bound/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/js-bound/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/js-bound?branch=main)

<sup>**Social Media Photo by [Ulf Meyer](https://unsplash.com/@travelling_mo) on [Unsplash](https://unsplash.com/)**</sup>

A utility to simplify binding methods to references.

### Example

```js
// direct: import bound from 'https://esm.run/js-bound/direct';
// cached: import bound from 'https://esm.run/js-bound/cached';
import bound from 'https://esm.run/js-bound';

const map = new Map;

// one-off *direct* binding
const { get, set } = bound(map);
// syntax shortcut for:
//  const get = map.get.bind(map);
//  const set = map.set.bind(map);

// repeated *cached* (always same) bindings
const reference = { method() { return this } };

// bind method once - noop next time `method` is retrieved
const { method } = bound(reference, true);

// the following assertion is true
console.assert(method === bound(reference).method);
```

### Exports

  * `js-bound/direct` to bind directly without *cache* orchestration: each binding is unique, ideal for one-off operations via `bound(ref:unknown)` signature
  * `js-bound/cached` to bind using a *weakly referenced cache* that avoids leaks while granting each bound method is created only once via `bound(ref:unknown)` signature
  * `js-bound` to bind with or without cache, includes both *direct* and *cached* variants via its `bound(ref:unknown, cache?:boolean)` signature

Each export returns a *Proxy* of the *reference* object with a specialized *get* trap that simply *binds* the retrieved method.

In the *cached* variant, both the *Proxy* and each bound methods are always the same but each bound method can garbage collect itself if not used anymore, keeping the amount of needed *RAM* overtime minimal for long running applications.
