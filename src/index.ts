import net from 'net';

import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import Packet from '#/io/Packet.ts';

import type ServerMessage from '#/network/server/ServerMessage.ts';
import GameServerRepository from '#/network/os1/server/game/prot/GameServerRepository.ts';
import RebuildNormal from '#/network/server/game/model/RebuildNormal.ts';
import IfOpenTop from '#/network/server/game/model/IfOpenTop.ts';

const cache = Js5OpenRs2Cache.OSRS_1;

// todo: abstract and move this code
const repo = new GameServerRepository();
function encodeServerMessage(buf: Packet, message: ServerMessage) {
    const encoder = repo.getEncoder(message);
    if (typeof encoder === 'undefined') {
        throw new Error(`Missing ${message.constructor.name} message encoder`);
    }

    if (buf.available < encoder.test(message)) {
        throw new Error(`Not enough bytes to write ${message.constructor.name} message`);
    }

    buf.p1(encoder.opcode);
    if (encoder.size === -1) {
        buf.p1(0);
    } else if (encoder.size === -2) {
        buf.p2(0);
    }
    const start = buf.pos;

    encoder.write(buf, message);

    if (encoder.size === -1) {
        buf.psize1(buf.pos - start);
    } else if (encoder.size === -2) {
        buf.psize2(buf.pos - start);
    }
}

const world = net.createServer((socket) => {
    let state = 0;

    socket.on('data', async (data) => {
        const buf = Packet.wrap(Uint8Array.from(data), false);

        // todo: tcp fragmentation can and will occur, this needs to be buffered and read
        // expect potential errors until then
        try {
            while (buf.available) {
                if (state === 0) {
                    const opcode = buf.g1();

                    if (opcode === 14) {
                        const reply = Packet.alloc(1);
                        reply.p1(0);
                        reply.send(socket);

                        state = 2;
                    } else if (opcode === 15) {
                        const _unk1 = buf.g4();

                        const reply = Packet.alloc(1);
                        reply.p1(0);
                        reply.send(socket);

                        state = 1;
                    } else {
                        console.log('unhandled opcode', buf.data);
                    }
                } else if (state === 1) {
                    const opcode = buf.g1();

                    if (opcode === 0 || opcode === 1) {
                        const archive = buf.g1();
                        const group = buf.g2();

                        // console.log('js5 - requesting', archive, group);

                        const raw = await cache.getGroup(archive, group);
                        if (!raw) {
                            continue;
                        }

                        if (archive === 255 && group === 255) {
                            const reply = Packet.alloc(3 + raw.length);

                            reply.p1(archive);
                            reply.p2(group);
                            reply.pdata(raw);

                            reply.send(socket);
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

                            reply.send(socket);
                        }
                    } else if (opcode === 2) {
                        console.log('js5 - is logged in');
                        buf.pos += 3;
                    } else if (opcode === 3) {
                        console.log('js5 - is logged out');
                        buf.pos += 3;
                    } else if (opcode === 4) {
                        console.log('js5 - xor swap (unsupported, js5io error)');
                        socket.end();
                        break;
                    } else {
                        console.log('js5 - unhandled opcode', buf.data);
                    }
                } else if (state === 2) {
                    const opcode = buf.g1();

                    if (opcode === 16) {
                        buf.pos = buf.length;

                        const reply = Packet.alloc(6);
                        reply.p1(2);
                        reply.p1(0);
                        reply.p1(0);
                        reply.p2(0);
                        reply.p1(0);
                        reply.send(socket);

                        const temp = Packet.alloc(5000);
                        encodeServerMessage(temp, new RebuildNormal(3222, 3222));
                        temp.send(socket);

                        temp.pos = 0;
                        encodeServerMessage(temp, new IfOpenTop(548));
                        temp.send(socket);

                        state = 3;
                    }
                } else if (state === 3) {
                    const opcode = buf.g1();
                    console.log(opcode, data);
                    break;
                } else {
                    socket.end();
                }
            }
        } catch (err) {
            console.log(err);
            socket.end();
        }
    });

    socket.on('error', () => socket.destroy());
});

await cache.predownload();
await cache.loadKeys();

world.listen({ host: '0.0.0.0', port: 40001 }, () => {
    console.log('World listening on port 40001');
});

// todo: port 50001
