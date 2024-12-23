import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpObj3 from "#/network/client/model/game/OpObj3.js";

export default class OpObj3Decoder extends MessageDecoder {
    opcode = 76;
    size = 8;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const parent = buf.g2_alt1();
        const com = buf.g4_alt2();
        const id = buf.g2_alt1();
        return new OpObj3(com, parent, id);
    }
}
