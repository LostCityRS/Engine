import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpNpc4 from "#/network/client/model/game/OpNpc4.js";

export default class OpNpc4Decoder extends MessageDecoder {
    opcode = 95;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const npcId = buf.g2_alt1();
        return new OpNpc4(npcId);
    }
}
