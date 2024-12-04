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

    close() {
        this.socket.end();
    }

    terminate() {
        this.socket.destroy();
    }
}
