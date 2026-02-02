const collect = typeof gc === 'function' ? gc : void 0;
const TIMEOUT = collect ? 200 : 2000;

const { delete: del } = Map.prototype;
const fr = new FinalizationRegistry(kind => console.log('finalize', kind));

const { Proxy: P } = globalThis;
let i = 0;

globalThis.Proxy = function Proxy(ref, handler) {
  const id = i++;
  const p = new P(ref, handler);
  fr.register(p, 'Proxy ' + id);
  fr.register(handler, 'Handler ' + id);
  return p;
};

Object.defineProperty(Map.prototype, 'delete', {
  value(key) {
    console.log('delete', key);
    return del.call(this, key);
  },
});

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const { default: bound } = await import('../index.js');

let obj = {
  a() {
    assert(this === obj, 'a');
  },
  b() {
    assert(this === obj, 'b');
  },
};

(function test() {
  let { a, b } = bound(obj, true);
  assert(bound(obj, true).a === a, 'cached bound');
  a();
  b();
  a = b = null;
  collect?.();
}());

function nullify() {
  collect?.();
  setTimeout(noCache, TIMEOUT);
}

function noCache() {
  let { a } = bound(obj);
  a();
  obj = a = null;
  collect?.();
  setTimeout(finalize, TIMEOUT);
}

function finalize() {
  collect?.();
  setTimeout(console.log, TIMEOUT, 'done');
}

setTimeout(nullify, TIMEOUT);
