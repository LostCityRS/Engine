import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import IfButton from "#/network/client/model/game/IfButton.js";

export default class IfButtonDecoder extends MessageDecoder {
    opcode = 155;
    size = 4;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const com = buf.g4();
        return new IfButton(com)
    }
}
