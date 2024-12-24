import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpNpc from "#/network/client/model/game/OpNpc.js";

export default class OpNpc5Decoder extends MessageDecoder {
    opcode = 88;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const npcId = buf.g2();
        return new OpNpc(5, npcId);
    }
}
