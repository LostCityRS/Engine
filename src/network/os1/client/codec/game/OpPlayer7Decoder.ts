import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpPlayer7 from "#/network/client/model/game/OpPlayer7.js";

export default class OpPlayer7Decoder extends MessageDecoder {
    opcode = 119;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const playerId = buf.g2_alt3();
        return new OpPlayer7(playerId);
    }
}
