import net from 'net';

import Js5 from '#/engine/Js5.ts';
import Login from '#/engine/Login.ts';
import World from '#/engine/World.ts';

import TcpSocket from '#/server/TcpSocket.ts';
import Packet from '#/io/Packet.ts';

export default class TcpServer {
    start(port: number) {
        const server = net.createServer(s => {
            s.setTimeout(30000);
            s.setNoDelay(true);

            const socket = new TcpSocket(s);

            s.on('data', async data => {
                // todo: stream-based reading
                try {
                    if (socket.state === 0) {
                        const buf = new Packet(data);

                        const opcode = buf.g1();
                        if (opcode === 14) {
                            const reply = Packet.alloc(1);
                            reply.p1(0);
                            socket.write(reply);

                            socket.state = 1;
                        } else if (opcode === 15) {
                            const revision = buf.g4();

                            const reply = Packet.alloc(1);
                            reply.p1(0);
                            socket.write(reply);

                            socket.state = 3;
                        } else {
                            console.log('Unhandled pre-login opcode', opcode);
                            socket.state = -1;
                        }
                    } else if (socket.state === 1) {
                        Login.readIn(socket, data);
                    } else if (socket.state === 2) {
                        World.readIn(socket, data);
                    } else if (socket.state === 3) {
                        await Js5.readIn(socket, data);
                    } else {
                        socket.terminate();
                    }
                } catch (err) {
                    socket.terminate();
                }
            });

            s.on('close', () => {
                if (socket.player) {
                    socket.player.client = null;
                    socket.player = null;
                }
            });

            s.on('end', () => {
                s.destroy();
            });

            s.on('error', () => {
                s.destroy();
            });

            s.on('timeout', () => {
                s.destroy();
            });
        });

        server.listen({
            host: '0.0.0.0',
            port: port
        }, () => {
            console.log(`Listening on port ${port}`);
        });
    }
}
