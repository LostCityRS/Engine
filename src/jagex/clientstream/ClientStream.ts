import net from 'net';

import { sleep } from '#lostcity/util/Time.js';

import Packet from '#jagex/bytepacking/Packet.js';

export default class ClientStream {
    static async connect(host: string, port: number): Promise<ClientStream> {
        return new Promise((res) => {
            const socket = net.createConnection({ host, port }, () => {
                res(new ClientStream(socket));
            });
        });
    }

    socket: net.Socket;
    closed: boolean = false;
    ioerror: boolean = false;
    buf: Buffer = Buffer.alloc(0);
    bufPos: number = 0;

    constructor(socket: net.Socket) {
        this.socket = socket;
        this.socket.setNoDelay(true);
        this.socket.setTimeout(30000);

        this.socket.on('data', (data) => {
            // console.log('read', data);
            this.buf = Buffer.concat([this.buf, data]);
        });

        this.socket.on('close', () => {
            this.close();
        });

        this.socket.on('error', () => {
            this.ioerror = true;
            this.close();
        });
    }

    close() {
        this.closed = true;

        if (this.socket) {
            this.socket.end();
        }
    }

    // wait for 1 byte to be read off the socket
    async read(): Promise<number> {
        if (this.closed && this.available === 0) {
            return -1;
        }

        while (this.available < 1) {
            await sleep(1);
        }

        const value = this.buf[this.bufPos++];

        if (this.bufPos >= 5000) {
            // shrink if at least 5kb has been read
            this.buf = this.buf.subarray(this.bufPos);
            this.bufPos = 0;
        }

        return value;
    }

    async readBytes(dest: Uint8Array | Buffer | Packet, len: number = dest.length, off: number = 0): Promise<boolean> {
        if (this.closed && this.available < len) {
            return false;
        }

        while (this.available < len) {
            await sleep(1);
        }

        if (dest instanceof Packet) {
            dest.raw.set(this.buf.subarray(this.bufPos, this.bufPos + len), off);
        } else {
            dest.set(this.buf.subarray(this.bufPos, this.bufPos + len), off);
        }

        this.bufPos += len;
        if (this.bufPos >= 5000) {
            // shrink if at least 5kb has been read
            this.buf = this.buf.subarray(this.bufPos);
            this.bufPos = 0;
        }

        return true;
    }

    get available() {
        return this.closed ? 0 : this.buf.length - this.bufPos;
    }

    write(src: Uint8Array | Buffer, len: number = src.length, off: number = 0) {
        if (this.closed) {
            return;
        }

        // console.log('write', src);
        if (len === src.length && off === 0) {
            this.socket.write(src);
        } else {
            this.socket.write(src.subarray(off, off + len));
        }
    }
}
