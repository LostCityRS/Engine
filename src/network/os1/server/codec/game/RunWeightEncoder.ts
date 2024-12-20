import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type RunWeight from '#/network/server/model/game/RunWeight.ts';

export default class RunWeightEncoder extends MessageEncoder {
    opcode = 1;
    size = 2;

    write(buf: Packet, message: RunWeight) {
        buf.p2(message.value);
    }
}
