import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpLoc from "#/network/client/model/game/OpLoc.js";

export default class OpLoc5Decoder extends MessageDecoder {
    opcode = 56;
    size = 6;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const x = buf.g2();
        const locId = buf.g2_alt1();
        const z = buf.g2_alt2();
        return new OpLoc(5, locId, x, z);
    }
}
