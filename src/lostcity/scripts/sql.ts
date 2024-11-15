import Js5DiskCache from '#jagex/js5/caching/Js5DiskCache.js';

const cache = new Js5DiskCache('C:/ProgramData/Jagex/RuneScape/js5-2.jcache');

console.log(await cache.readIndex());
