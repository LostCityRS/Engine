import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpNpc3 from "#/network/client/model/game/OpNpc3.js";

export default class OpNpc3Decoder extends MessageDecoder {
    opcode = 67;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const npcId = buf.g2_alt1();
        return new OpNpc3(npcId);
    }
}