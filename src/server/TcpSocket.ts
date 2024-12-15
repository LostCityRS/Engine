import net from 'net';

import ClientSocket from '#/server/ClientSocket.ts';
import Packet from '#/io/Packet.ts';

export default class TcpSocket extends ClientSocket {
    constructor(
        readonly socket: net.Socket
    ) {
        super();
    }

    write(src: Uint8Array | Packet) {
        if (src instanceof Packet) {
            this.socket.write(src.data.subarray(0, src.pos));
        } else {
            this.socket.write(src);
        }
    }

    buffer(data: Buffer): void {
        this.inBuffer.set(data, this.inBufferPos);
        this.inBufferPos += data.length;
    }

    get available(): number {
        return this.inBufferPos;
    }

    read(dest: Uint8Array, offset: number, length: number): void {
        dest.set(this.inBuffer.subarray(0, length), offset);
        this.inBufferPos -= length;
        this.inBuffer.set(this.inBuffer.subarray(length), 0);
    }

    close() {
        this.socket.end();
    }

    terminate() {
        this.socket.destroy();
    }
}
