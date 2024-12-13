import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import NoOp from '#/network/client/game/model/NoOp.ts';

export default class NoOpDecoder extends MessageDecoder {
    opcode = -1;
    size = -1;

    constructor(opcode: number, size: number) {
        super();

        this.opcode = opcode;
        this.size = size;
    }

    read(buf: Packet, length: number): ClientMessage {
        return new NoOp();
    }
}
