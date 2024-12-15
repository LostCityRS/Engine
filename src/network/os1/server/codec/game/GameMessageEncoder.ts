import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type GameMessage from '#/network/server/model/game/GameMessage.ts';

export default class GameMessageEncoder extends MessageEncoder {
    opcode = 100;
    size = -1;

    write(buf: Packet, message: GameMessage) {
        buf.pjstr(message.message)
    }
}
