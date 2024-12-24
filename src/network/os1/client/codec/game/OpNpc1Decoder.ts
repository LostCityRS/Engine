import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpNpc from "#/network/client/model/game/OpNpc.js";

export default class OpNpc1Decoder extends MessageDecoder {
    opcode = 84;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const npcId = buf.g2_alt3();
        return new OpNpc(1, npcId);
    }
}
