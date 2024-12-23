import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpObj1 from "#/network/client/model/game/OpObj1.js";

export default class OpObj1Decoder extends MessageDecoder {
    opcode = 135;
    size = 8;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const com = buf.g4_alt2();
        const id = buf.g2_alt3();
        const parent = buf.g2_alt3();
        return new OpObj1(com, parent, id);
    }
}
