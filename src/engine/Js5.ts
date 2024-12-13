import Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

class Js5 {
    cache = Js5OpenRs2Cache.OSRS_1;

    async decode(socket: ClientSocket, data: Buffer) {
        const buf = new Packet(data);

        while (buf.available > 0) {
            const opcode = buf.g1();

            if (opcode === 0 || opcode === 1) {
                const archive = buf.g1();
                const group = buf.g2();

                const raw = await this.cache.getGroup(archive, group);
                if (!raw) {
                    continue;
                }

                if (archive === 255 && group === 255) {
                    const reply = Packet.alloc(3 + raw.length);

                    reply.p1(archive);
                    reply.p2(group);
                    reply.pdata(raw);

                    socket.write(reply);
                } else {
                    const compression = raw[0];
                    const length = raw[1] << 24 | raw[2] << 16 | raw[3] << 8 | raw[4];
                    const realLength = compression != 0 ? length + 4 : length;

                    const reply = Packet.alloc(9 + realLength + Math.floor((9 + realLength) / 512));

                    reply.p1(archive);
                    reply.p2(group);
                    reply.p1(compression);
                    reply.p4(length);

                    try {
                        for (let i = 5; i < realLength + 5; i++) {
                            if ((reply.pos % 512) == 0) {
                                reply.p1(0xFF);
                            }

                            reply.p1(raw[i]);
                        }
                    } catch (err) {
                        console.log('failed to write', archive, group);
                        continue;
                    }

                    socket.write(reply);
                }
            } else if (opcode === 2) {
                console.log('js5 - is logged in');
                buf.pos += 3;
            } else if (opcode === 3) {
                console.log('js5 - is logged out');
                buf.pos += 3;
            } else if (opcode === 4) {
                console.log('js5 - xor swap (unsupported, js5io error)');
                socket.close();
                break;
            } else {
                console.log('js5 - unhandled opcode', buf.data);
            }
        }
    }
}

export default new Js5();
