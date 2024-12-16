import zlib from 'zlib';

import type Packet from '#/io/Packet.ts';

export default class GZip {
    static decompress(buf: Packet) {
        // assumes the rest of the data available is compressed
        return Uint8Array.from(zlib.gunzipSync(buf.data.subarray(buf.pos)));
    }
}
