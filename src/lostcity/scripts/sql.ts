import Js5LocalCache from '#jagex/js5/Js5LocalCache.js';

const cache = new Js5LocalCache('C:/ProgramData/Jagex/RuneScape/js5-2.jcache');

console.log(await cache.readIndex());
