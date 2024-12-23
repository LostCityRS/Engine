import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpObj4 from "#/network/client/model/game/OpObj4.js";

export default class OpObj4Decoder extends MessageDecoder {
    opcode = 220;
    size = 8;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const com = buf.g4_alt3();
        const parent = buf.g2_alt2();
        const id = buf.g2_alt1();
        return new OpObj4(com, parent, id);
    }
}
