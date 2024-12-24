import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpLoc from "#/network/client/model/game/OpLoc.js";

export default class OpLoc2Decoder extends MessageDecoder {
    opcode = 90;
    size = 6;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const z = buf.g2_alt3();
        const x = buf.g2_alt3();
        const locId = buf.g2_alt2();
        return new OpLoc(2, locId, x, z);
    }
}
