import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type PlaySound from '#/network/server/model/game/PlaySound.ts';

export default class PlaySoundEncoder extends MessageEncoder {
    opcode = 229;
    size = 5;

    write(buf: Packet, message: PlaySound) {
        buf.p2(message.id);
        buf.p1(message.immediate ? 1 : 0); //verify
        buf.p2(message.delay)
    }
}
