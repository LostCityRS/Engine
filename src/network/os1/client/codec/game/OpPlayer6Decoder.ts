import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpPlayer6 from "#/network/client/model/game/OpPlayer6.js";

export default class OpPlayer6Decoder extends MessageDecoder {
    opcode = 111;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const playerId = buf.g2_alt3();
        return new OpPlayer6(playerId);
    }
}
