import type ClientMessage from '#/network/client/ClientMessage.ts';

import type MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import type MessageHandler from '#/network/client/handler/MessageHandler.ts';

export default class ClientRepository {
    private messages: Map<number, ClientMessage> = new Map(); // opcode -> message
    private decoders: Map<ClientMessage, MessageDecoder> = new Map(); // message -> decoder
    private handlers: Map<ClientMessage, MessageHandler> = new Map(); // message -> handler

    protected bind(message: ClientMessage, decoder: MessageDecoder, handler: MessageHandler) {
        this.messages.set(decoder.opcode, message);
        this.decoders.set(message, decoder);
        this.handlers.set(message, handler);
    }

    getMessage(opcode: number) {
        return this.messages.get(opcode);
    }

    getDecoder(message: ClientMessage): MessageDecoder | undefined {
        return this.decoders.get(message);
    }

    getHandler(message: ClientMessage): MessageHandler | undefined {
        return this.handlers.get(message);
    }
}
