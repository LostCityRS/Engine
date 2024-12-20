import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import NoOp from '#/network/client/model/game/NoOp.ts';
import Logout from '#/network/server/model/game/Logout.ts';

export default class InterfaceClickDecoder extends MessageDecoder {
    opcode = 155;
    size = 4;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet): ClientMessage {
        const iface = buf.g4();

        if (iface === 11927558)
            return new Logout()

        console.log('iface click: ', iface)
        return NoOp
    }
}
