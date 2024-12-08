import NetworkPlayer from '#/engine/NetworkPlayer.ts';
import Player from '#/engine/Player.ts';
import World from '#/engine/World.ts';
import Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

class Login {
    cache = Js5OpenRs2Cache.OSRS_1;

    readIn(socket: ClientSocket, data: Buffer) {
        const buf = new Packet(data);

        while (buf.available > 0) {
            const opcode = buf.g1();
            if (opcode === 16 || opcode === 18) {
                buf.pos = buf.length; // todo: read login packet

                const player = new NetworkPlayer(socket);
                World.addPlayer(player);
            } else {
                socket.close();
            }
        }
    }
}

export default new Login();
