import Js5 from '#/engine/Js5.ts';
import NetworkPlayer from '#/engine/NetworkPlayer.ts';
import World from '#/engine/World.ts';
import Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

class Login {
    cache = Js5OpenRs2Cache.OSRS_1;

    decode(client: ClientSocket, data: Buffer) {
        const buf = new Packet(data);

        while (buf.available > 0) {
            const opcode = buf.g1();

            if (opcode === 14) {
                const reply = Packet.alloc(1);
                reply.p1(0);
                client.write(reply);
            } else if (opcode === 15) {
                const _revision = buf.g4();

                // todo: out of date response

                Js5.addClient(client);
            } else if (opcode === 16 || opcode === 18) {
                buf.pos = buf.length;

                // todo: read login packet

                const player = new NetworkPlayer(client);
                World.addPlayer(player);
            } else {
                client.close();
            }
        }
    }
}

export default new Login();
