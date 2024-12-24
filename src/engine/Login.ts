import Js5 from '#/engine/Js5.ts';
import NetworkPlayer from '#/engine/NetworkPlayer.ts';
import World from '#/engine/World.ts';
import Packet from '#/io/Packet.ts';
import OpenRs2 from '#/util/OpenRs2.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

class Login {
    cache = OpenRs2.OSRS_1;

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
                const len = buf.g2()
                const rev = buf.g4();

                //todo: isaac
                const isaac10 = buf.g1();
                const seed0 = buf.g4();
                const seed1 = buf.g4();
                const seed2 = buf.g4();
                const seed3 = buf.g4();
                const isaac0 = buf.g8();

                const password = buf.gjstr();

                //todo: rsa
                const rsaLen = buf.g2();
                buf.pos += rsaLen;

                const username = buf.gjstr();
                const lowMemory = buf.g1();

                //todo: uid dat
                buf.pos += 24;

                const animFrameJs5Crc = buf.g4();
                const animBaseJs5Crc = buf.g4();
                const configJs5Crc = buf.g4();
                const interfaceJs5Crc = buf.g4();
                const synthSoundJs5Crc = buf.g4();
                const mapJs5Crc = buf.g4();
                const midiSongJs5Crc = buf.g4();
                const modelJs5Crc = buf.g4();
                const spriteJs5Crc = buf.g4();
                const textureJs5Crc = buf.g4();
                const binaryJs5Crc = buf.g4();
                const midiJingleJs5 = buf.g4();
                const clientScriptJs5Crc = buf.g4();
                const fontMetricJs5Crc = buf.g4();
                const vorbisJs5Crc = buf.g4();
                const midiInstrumentJs5Crc = buf.g4();

                // todo: process login

                const player = new NetworkPlayer(client);
                World.addPlayer(player, opcode === 18);
            } else {
                client.close();
            }
        }
    }
}

export default new Login();
