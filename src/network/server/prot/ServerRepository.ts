import type ServerMessage from '#/network/server/ServerMessage.ts';

import type MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

export default class ServerRepository {
    private encoders: Map<ServerMessage, MessageEncoder> = new Map();

    protected bind(message: ServerMessage, encoder: MessageEncoder) {
        this.encoders.set(message, encoder);
    }

    getEncoder(message: ServerMessage): MessageEncoder | undefined {
        return this.encoders.get(message.constructor);
    }
}
