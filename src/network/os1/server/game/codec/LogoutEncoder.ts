import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type Logout from '#/network/server/game/model/Logout.ts';

export default class LogoutEncoder extends MessageEncoder {
    opcode = 224;
    size = 0;

    write(buf: Packet, message: Logout) {}
}
