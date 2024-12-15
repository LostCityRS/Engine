import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type IfOpenTop from '#/network/server/model/game/IfOpenTop.ts';

export default class IfOpenTopEncoder extends MessageEncoder {
    opcode = 147;
    size = 2;

    write(buf: Packet, message: IfOpenTop) {
        buf.p2_alt1(message.interfaceId);
    }
}
