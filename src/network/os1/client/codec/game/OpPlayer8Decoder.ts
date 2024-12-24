import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpPlayer from "#/network/client/model/game/OpPlayer.js";

export default class OpPlayer8Decoder extends MessageDecoder {
    opcode = 145;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const playerId = buf.g2_alt1();
        return new OpPlayer(8, playerId);
    }
}
