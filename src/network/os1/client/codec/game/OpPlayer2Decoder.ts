import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpPlayer2 from "#/network/client/model/game/OpPlayer2.js";

export default class OpPlayer2Decoder extends MessageDecoder {
    opcode = 146;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const playerId = buf.g2();
        return new OpPlayer2(playerId);
    }
}
