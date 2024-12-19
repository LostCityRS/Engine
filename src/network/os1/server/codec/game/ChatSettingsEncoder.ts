import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type ChatSettings from '#/network/server/model/game/ChatSettings.ts';

export default class ChatSettingsEncoder extends MessageEncoder {
    opcode = 137;
    size = 2;

    write(buf: Packet, message: ChatSettings) {
        buf.p1(message.publicChatFilter);
        buf.p1(message.tradeChatFilter);
    }
}
