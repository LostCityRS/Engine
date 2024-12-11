import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type PrivateMessage from '#/network/server/game/model/PrivateMessage.ts';

export default class PrivateMessageEncoder extends MessageEncoder {
    opcode = 86;
    size = -2;

    write(buf: Packet, message: PrivateMessage) {
        buf.pjstr(message.message)
        buf.p2(message.u1)
        buf.p3(message.u2)
        buf.p1(message.u3)
    }
}
