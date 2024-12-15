import Packet from '#/io/Packet.ts';

import Player from '#/engine/Player.ts';

import type ClientSocket from '#/server/ClientSocket.ts';

import type ServerMessage from '#/network/server/ServerMessage.ts';

import GameServerRepository from '#/network/os1/server/prot/GameServerRepository.ts';
import GameClientRepository from '#/network/os1/client/prot/game/GameClientRepository.ts';

export default class NetworkPlayer extends Player {
    static serverRepo = new GameServerRepository();
    static clientRepo = new GameClientRepository();

    constructor(client: ClientSocket) {
        super();

        this.client = client;
        this.client.player = this;
    }

    // todo: stream based sockets
    decode(data: Buffer) {
        const buf = new Packet(data);

        while (buf.available > 0) {
            const opcode = buf.g1();

            const decoder = NetworkPlayer.clientRepo.getDecoder(opcode);
            if (typeof decoder === 'undefined') {
                console.error(`Unregistered game message decoder: ${opcode}`);
                break;
            }

            const handler = NetworkPlayer.clientRepo.getHandler(opcode);
            if (typeof handler === 'undefined') {
                console.error(`Unregistered game message handler: ${opcode}`);
                break;
            }

            // todo: check if x bytes are available
            let length = decoder.size;
            if (decoder.size === -1) {
                length = buf.g1();
            } else if (decoder.size === -2) {
                length = buf.g2();
            }

            const start = buf.pos;
            const read = decoder.read(buf, length);
            buf.pos = start + length;

            if (!handler.handle(read, this)) {
                console.error(`Packet handler: ${read.constructor.name} returned false`);
            }
        }
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
