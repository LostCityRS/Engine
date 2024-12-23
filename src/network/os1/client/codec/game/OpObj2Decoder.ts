import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpObj2 from "#/network/client/model/game/OpObj2.js";

export default class OpObj2Decoder extends MessageDecoder {
    opcode = 179;
    size = 8;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const parent = buf.g2_alt3();
        const id = buf.g2_alt2();
        const com = buf.g4_alt1();
        return new OpObj2(com, parent, id);
    }
}
