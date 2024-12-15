import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type GameMessage from '#/network/server/model/game/MessageGame.ts';

export default class MessageGameEncoder extends MessageEncoder {
    opcode = 100;
    size = -1;

    write(buf: Packet, message: GameMessage) {
        buf.pjstr(message.message)
    }
}
