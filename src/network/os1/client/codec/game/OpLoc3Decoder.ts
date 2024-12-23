import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpLoc3 from "#/network/client/model/game/OpLoc3.js";

export default class OpLoc3Decoder extends MessageDecoder {
    opcode = 133;
    size = 6;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const x = buf.g2_alt2();
        const z = buf.g2_alt2();
        const locId = buf.g2_alt3();
        return new OpLoc3(locId, x, z);
    }
}