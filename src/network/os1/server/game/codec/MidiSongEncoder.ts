import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type MidiSong from '#/network/server/game/model/MidiSong.ts';

export default class PlaySongEncoder extends MessageEncoder {
    opcode = 211;
    size = 2;

    write(buf: Packet, message: MidiSong) {
        buf.p2_alt1(message.id)
    }
}
