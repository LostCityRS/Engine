import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import LocExamine from "#/network/client/model/game/LocExamine.js";

export default class LocExamineDecoder extends MessageDecoder {
    opcode = 162;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const id = buf.g2_alt2();
        return new LocExamine(id);
    }
}
