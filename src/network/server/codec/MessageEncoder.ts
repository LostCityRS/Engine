import type Packet from '#/io/Packet.ts';

import type OutgoingMessage from '#/network/server/ServerMessage.ts';

export default abstract class MessageEncoder {
    abstract opcode: number;
    abstract size: number;

    abstract write(buf: Packet, message: OutgoingMessage): void;

    test(_: OutgoingMessage): number {
        return this.size;
    }
}
