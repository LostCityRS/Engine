import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type ChatFilterSettings from '#/network/server/model/game/ChatFilterSettings.ts';

export default class ChatFilterSettingsEncoder extends MessageEncoder {
    opcode = 137;
    size = 2;

    write(buf: Packet, message: ChatFilterSettings) {
        buf.p1(message.publicChatFilter);
        buf.p1(message.tradeChatFilter);
    }
}
