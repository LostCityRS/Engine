import Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import Js5ServerRepository from '#/network/os1/server/prot/Js5ServerRepository.ts';
import Js5GroupResponse from '#/network/server/model/js5/Js5GroupResponse.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

type Js5Request = {
    client: ClientSocket;
    archive: number;
    group: number;
}

class Js5 {
    static cache = Js5OpenRs2Cache.OSRS_1;

    static serverRepo = new Js5ServerRepository();

    urgent: Js5Request[] = [];
    prefetch: Js5Request[] = [];

    async load() {
        await Js5.cache.predownload();

        this.cycle();
    }

    async cycle() {
        // todo: limit # of requests per client?
        for (let i = 0; i < this.urgent.length; i++) {
            const req = this.urgent.splice(i--, 1)[0];

            const data = await Js5.cache.getGroup(req.archive, req.group);
            if (!data) {
                continue;
            }

            const message = new Js5GroupResponse(req.archive, req.group, false, data, 0);
            const encoder = Js5.serverRepo.getEncoder(message);
            if (!encoder) {
                continue;
            }

            const buf = Packet.alloc(1_000_000); // todo: buffer pooling
            encoder.write(buf, message);
            req.client.write(buf);
        }

        for (let i = 0; i < this.prefetch.length; i++) {
            const req = this.prefetch.splice(i--, 1)[0];

            const data = await Js5.cache.getGroup(req.archive, req.group);
            if (!data) {
                continue;
            }

            const message = new Js5GroupResponse(req.archive, req.group, true, data, 0);
            const encoder = Js5.serverRepo.getEncoder(message);
            if (!encoder) {
                continue;
            }

            const buf = Packet.alloc(1_000_000); // todo: buffer pooling
            encoder.write(buf, message);
            req.client.write(buf);
        }

        // todo: account for drift due to event loop/OS scheduling
        setTimeout(this.cycle.bind(this), 50);
    }

    async decode(client: ClientSocket, data: Buffer) {
        const buf = new Packet(data);

        while (buf.available > 0) {
            const opcode = buf.g1();

            if (opcode === 0 || opcode === 1) {
                const archive = buf.g1();
                const group = buf.g2();

                if (opcode === 0) {
                    this.prefetch.push({ client, archive, group });
                } else if (opcode === 1) {
                    this.urgent.push({ client, archive, group });
                }
            } else if (opcode === 2) {
                console.log('js5 - is logged in');
                buf.pos += 3;
            } else if (opcode === 3) {
                console.log('js5 - is logged out');
                buf.pos += 3;
            } else if (opcode === 4) {
                console.log('js5 - xor swap (unsupported, js5io error)');
                client.close();
                break;
            } else {
                console.log('js5 - unhandled opcode', buf.data);
            }
        }
    }
}

export default new Js5();
