import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import ObjExamine from "#/network/client/model/game/ObjExamine.js";

export default class TileObjExamineDecoder extends MessageDecoder {
    opcode = 49;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const idx = buf.g2_alt1();
        return new ObjExamine(idx);
    }
}
