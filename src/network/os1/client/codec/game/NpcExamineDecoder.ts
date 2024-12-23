import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import NpcExamine from "#/network/client/model/game/NpcExamine.js";

export default class NpcExamineDecoder extends MessageDecoder {
    opcode = 52;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const idx = buf.g2();
        return new NpcExamine(idx);
    }
}
