import type Packet from '#/io/Packet.ts';

import type ServerMessage from '#/network/server/ServerMessage.ts';

export default abstract class MessageEncoder {
    abstract opcode: number;
    abstract size: number;

    abstract write(buf: Packet, message: ServerMessage): void;

    test(_: ServerMessage): number {
        return this.size;
    }
}
