import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type IfOpenSub from '#/network/server/model/game/IfOpenSub.ts';

export default class IfOpenSubEncoder extends MessageEncoder {
    opcode = 184;
    size = 7;

    write(buf: Packet, message: IfOpenSub) {
        buf.p1_alt2(message.type);
        buf.p2_alt2(message.subInterfaceId);
        buf.p4_alt1(message.interfaceId);
    }
}
