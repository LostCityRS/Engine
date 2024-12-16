import BZ2Wasm from '#/3rdparty/bzip2-wasm/bzip2-wasm.js';

import type Packet from '#/io/Packet.ts';

const bzip2 = new BZ2Wasm();
await bzip2.init();

export default class BZip2 {
    static decompress(buf: Packet, ulen: number) {
        // assumes the rest of the data available is compressed
        return bzip2.decompress(buf.data.subarray(buf.pos), ulen, true);
    }
}
