import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type PrivateChatFilter from '#/network/server/model/game/PrivateChatFilter.ts';

export default class PrivateChatFilterEncoder extends MessageEncoder {
    opcode = 70;
    size = 1;

    write(buf: Packet, message: PrivateChatFilter) {
        buf.p1(message.value);
    }
}
