import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import Logout from '#/network/server/model/game/Logout.ts';

export default class LogoutDecoder extends MessageDecoder {
    opcode = 155;
    size = 4;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const iface = buf.g4();

        return new Logout()
    }
}
