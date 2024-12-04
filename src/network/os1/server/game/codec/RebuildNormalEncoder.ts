import type Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type RebuildNormal from '#/network/server/game/model/RebuildNormal.ts';

export default class RebuildNormalEncoder extends MessageEncoder {
    opcode = 21;
    size = -2;

    write(buf: Packet, message: RebuildNormal) {
        const x = message.absX;
        const z = message.absZ;

        const zx = x >> 3;
        const zz = z >> 3;

        // todo: helper class to get local coord
        buf.p2(z - ((zz - 6) << 3));
        buf.p2_alt1(x - ((zx - 6) << 3));

        // todo: better key provider
        for (let mx = (zx - 6) >> 3; mx <= (zx + 6) >> 3; mx++) {
            for (let mz = (zz - 6) >> 3; mz <= (zz + 6) >> 3; mz++) {
                const key = Js5OpenRs2Cache.OSRS_1.getKey(mx, mz);
                for (let i = 0; i < 4; i++) {
                    buf.p4_alt2(key[i]);
                }
            }
        }

        buf.p1_alt2(0); // todo

        buf.p2(zx);
        buf.p2_alt3(zz);
    }

    test(message: RebuildNormal): number {
        const x = message.absX;
        const z = message.absZ;

        const zx = x >> 3;
        const zz = z >> 3;

        let maps = 0;
        for (let mx = (zx - 6) >> 3; mx <= (zx + 6) >> 3; mx++) {
            for (let mz = (zz - 6) >> 3; mz <= (zz + 6) >> 3; mz++) {
                for (let i = 0; i < 4; i++) {
                    maps++;
                }
            }
        }

        return 2 + 2 + (maps * 16) + 1 + 2 + 2;
    }
}
