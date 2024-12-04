import net from 'net';

import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import Packet from '#/io/Packet.ts';

const cache = Js5OpenRs2Cache.OSRS_1;
const keys = await cache.getKeys();

function getKey(x: number, z: number) {
    const id = x << 8 | z;

    const entry = keys.find(k => k.mapsquare === id);
    if (!entry) {
        return [0, 0, 0, 0];
    } else {
        return entry.key;
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

                        const rebuild = Packet.alloc(5000);
                        rebuild.p1(21);
                        rebuild.p2(0);
                        let start = rebuild.pos;

                        const x = 3200;
                        const z = 3200;
                        const zx = x >> 3;
                        const zz = z >> 3;

                        // local coord
                        rebuild.p2(z - ((zz - 6) << 3));
                        rebuild.p2_alt1(x - ((zx - 6) << 3));

                        for (let mx = (zx - 6) >> 3; mx <= (zx + 6) >> 3; mx++) {
                            for (let mz = (zz - 6) >> 3; mz <= (zz + 6) >> 3; mz++) {
                                const key = getKey(mx, mz);
                                for (let i = 0; i < 4; i++) {
                                    // xtea keys
                                    rebuild.p4_alt2(key[i]);
                                }
                            }
                        }

                        rebuild.p1_alt2(0);

                        // zone coord
                        rebuild.p2(x >> 3);
                        rebuild.p2_alt3(z >> 3);

                        rebuild.psize2(rebuild.pos - start);

                        const toplevel = Packet.alloc(3);
                        toplevel.p1(147);
                        toplevel.p2_alt1(548);

                        // const playerinfo = Packet.alloc(5000);
                        // playerinfo.p1(113);
                        // playerinfo.p2(0);
                        // start = playerinfo.pos;

                        // playerinfo.bits();
                        // playerinfo.pBit(1, 0);
                        // playerinfo.pBit(8, 0);
                        // playerinfo.pBit(11, 2047);
                        // playerinfo.bytes();

                        // playerinfo.psize2(playerinfo.pos - start);

                        reply.send(socket);
                        rebuild.send(socket);
                        toplevel.send(socket);
                        // playerinfo.send(socket);
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
world.listen({ host: '0.0.0.0', port: 40001 }, () => {
    console.log('World listening on port 40001');
});

// todo: port 50001
