import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type RunEnergy from '#/network/server/model/game/RunEnergy.ts';

export default class RunEnergyEncoder extends MessageEncoder {
    opcode = 41;
    size = 1;

    write(buf: Packet, message: RunEnergy) {
        buf.p1(message.value);
    }
}
