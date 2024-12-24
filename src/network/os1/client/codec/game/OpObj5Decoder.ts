import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpObj from "#/network/client/model/game/OpObj.js";

export default class OpObj5Decoder extends MessageDecoder {
    opcode = 19;
    size = 8;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const id = buf.g2();
        const com = buf.g4();
        const parent = buf.g2_alt2();

        return new OpObj(5, com, parent, id);
    }
}
