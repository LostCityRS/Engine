import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import OpPlayer from "#/network/client/model/game/OpPlayer.js";

export default class OpPlayer5Decoder extends MessageDecoder {
    opcode = 117;
    size = 2;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const playerId = buf.g2_alt2();
        return new OpPlayer(5, playerId);
    }
}
