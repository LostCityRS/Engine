import type MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import type MessageHandler from '#/network/client/handler/MessageHandler.ts';

export default class ClientRepository {
    private decoders: Map<number, MessageDecoder> = new Map(); // opcode -> decoder
    private handlers: Map<number, MessageHandler> = new Map(); // opcode -> handler

    protected bind(decoder: MessageDecoder, handler: MessageHandler) {
        this.decoders.set(decoder.opcode, decoder);
        this.handlers.set(decoder.opcode, handler);
    }

    getDecoder(opcode: number): MessageDecoder | undefined {
        return this.decoders.get(opcode);
    }

    getHandler(opcode: number): MessageHandler | undefined {
        return this.handlers.get(opcode);
    }
}
