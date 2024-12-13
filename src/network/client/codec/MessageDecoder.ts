import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';

export default abstract class MessageDecoder {
    abstract opcode: number;
    abstract size: number;

    abstract read(buf: Packet, length: number): ClientMessage;
}
