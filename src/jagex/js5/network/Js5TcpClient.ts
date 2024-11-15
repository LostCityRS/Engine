import Packet from '#jagex/bytepacking/Packet.js';
import ClientStream from '#jagex/clientstream/ClientStream.js';
import { JavConfig } from '#jagex/javapal/JavConfig.js';

export default class Js5TcpClient {
    static async connectToRs3(config: JavConfig) {
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

    async init(config: JavConfig) {
        this.initJs5RemoteConnection(config);

        const status = await this.stream.read();
        if (status !== 0) {
            throw new Error(`Bad JS5 response: ${status}`);
        }

        this.connected(config);
    }

    // todo: should be abstracted one level higher (LoginProt) - not a "part of" Js5 itself, but a requirement to set up the connection
    initJs5RemoteConnection(config: JavConfig) {
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

    connected(config: JavConfig) {
        this.out.pos = 0;
        this.out.p1(6); // opcode

        this.out.p3(5); // protocol version?
        this.out.p2(0);
        this.out.p2(config.serverVersion);
        this.out.p2(0);

        this.stream.write(this.out.data);
    }

    request(config: JavConfig, prefetch: boolean, archive: number, group: number) {
        this.out = Packet.alloc(10);
        this.out.p1(prefetch ? 32 : 33); // opcode

        this.out.p1(archive);
        this.out.p4(group);
        this.out.p2(config.serverVersion);
        this.out.p2(0);

        this.stream.write(this.out.data);
    }
}
