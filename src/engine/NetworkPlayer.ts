import Packet from '#/io/Packet.ts';

import type ServerMessage from '#/network/server/ServerMessage.ts';
import GameServerRepository from '#/network/os1/server/game/prot/GameServerRepository.ts';
import type ClientSocket from '#/server/ClientSocket.ts';
import Player from '#/engine/Player.ts';

export default class NetworkPlayer extends Player {
    static serverRepo = new GameServerRepository();

    constructor(client: ClientSocket) {
        super();

        this.client = client;
    }

    write(message: ServerMessage) {
        if (!this.client) {
            return;
        }

        const buf = Packet.alloc(5000);

        const encoder = NetworkPlayer.serverRepo.getEncoder(message);
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

        this.client.write(buf);
    }
}
