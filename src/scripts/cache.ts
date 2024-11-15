import fs from 'fs';
import net from 'net';

import { JavaConfig, NxtClientBinaryType } from '#jagex/JavaConfig.ts';
import Packet from '#jagex/Packet.ts';

function sleep(ms: number) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

class ClientStream {
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

class Js5TcpClient {
    static async connectToRs3(config: JavaConfig) {
        const client = new Js5TcpClient(await ClientStream.connect('content.runescape.com', 443));
        await client.init(config);
        return client;
    }

    stream: ClientStream;
    out: Packet = Packet.alloc(10);
    server: Packet = Packet.alloc(5);
    client: Packet = Packet.alloc(5);

    constructor(stream: ClientStream) {
        this.stream = stream;
    }

    async init(config: JavaConfig) {
        this.initJs5RemoteConnection(config);

        const status = await this.stream.read();
        if (status !== 0) {
            throw new Error(`Bad JS5 response: ${status}`);
        }

        this.connected(config);
    }

    // todo: should be abstracted one level higher (LoginProt) - not a "part of" Js5 itself, but a requirement to set up the connection
    initJs5RemoteConnection(config: JavaConfig) {
        const req = Packet.alloc(44);
        req.p1(15); // INIT_JS5REMOTE_CONNECTION
        req.p1(0);
        const start = req.pos;

        req.p4(config.serverVersion); // major rev
        req.p4(1); // minor rev
        req.pjstr(config.token); // token
        req.p1(0); // lang id

        req.psize1(req.pos - start);
        this.stream.write(req.data);
    }

    connected(config: JavaConfig) {
        this.out.pos = 0;
        this.out.p1(6); // opcode

        this.out.p3(5); // protocol version?
        this.out.p2(0);
        this.out.p2(config.serverVersion);
        this.out.p2(0);

        this.stream.write(this.out.data);
    }

    request(config: JavaConfig, prefetch: boolean, archive: number, group: number) {
        this.out = Packet.alloc(10);
        this.out.p1(prefetch ? 32 : 33); // opcode

        this.out.p1(archive);
        this.out.p4(group);
        this.out.p2(config.serverVersion);
        this.out.p2(0);

        this.stream.write(this.out.data);
    }
}

if (!fs.existsSync('data/client')) {
    fs.mkdirSync('data/client', { recursive: true });
}

if (!fs.existsSync('data/client/jav_config.ws')) {
    const config = await JavaConfig.decodeFromRs3(NxtClientBinaryType.MacOS);
    if (!config) {
        console.error('Failed to download template jav_config.ws');
        process.exit(1);
    }

    fs.writeFileSync('data/client/jav_config.ws', config.encode(true));
}

const config = JavaConfig.decode(fs.readFileSync('data/client/jav_config.ws', 'ascii'));
if (!config) {
    console.error('Failed to decode jav_config.ws');
    process.exit(1);
}

const js5 = await Js5TcpClient.connectToRs3(config);
js5.request(config, true, 255, 255);

js5.client.pos = 0;
await js5.stream.readBytes(js5.client, 5, 0);
const archive = js5.client.g1();
const groupPrefetch = js5.client.g4();
const prefetch: boolean = (groupPrefetch & 0x80000000) != 0;
const group: number = (groupPrefetch & ~0x80000000);
console.log(`received data for archive:${archive} prefetch:${prefetch} group:${group}`);

js5.server.pos = 0;
await js5.stream.readBytes(js5.server, 5, 0);
const compression = js5.server.g1();
const length = js5.server.g4();
console.log(`compression method:${compression} length:${length}`);

const totalLength = compression === 0 ? length + 5 : length;
const file = Buffer.alloc(totalLength);
file.set(js5.server.raw);
await js5.stream.readBytes(file, length, 5);
console.log(file);

await sleep(5000);
js5.stream.close();
