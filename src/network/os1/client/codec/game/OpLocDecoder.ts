import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpLoc from "#/network/client/model/game/OpLoc.js";

export default class OpLocDecoder extends MessageDecoder {
    opcode = 73;
    size = 6;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const locId = buf.g2_alt2();
        const x = buf.g2();
        const z = buf.g2();
        return new OpLoc(1, locId, x, z);
    }
}
